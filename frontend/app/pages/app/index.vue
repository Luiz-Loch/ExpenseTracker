<template>
  <div>
    <DashboardHeader />

    <AppLoading v-if="loading" />

    <!-- Summary itens: total expenses, balance and highest category -->
    <template v-else>
      <DashboardSummaryCards :summary="summary" :prev-summary="prevMonthSummary" :month-label="currentMonthLabel" />

      <!-- Charts -->
      <DashboardCharts :summary="summary" :months="last12Months" />

      <!-- Last 5 expenses -->
      <DashboardRecentExpenses :expenses="recentExpenses" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { MonthlyDataPoint } from '~/components/dashboard/chart/cards/DashboardMonthlyChart.vue';
import type { ExpenseResponse } from '~/types/expense'
import type { MonthlyReportResponse, SummaryReportResponse } from '~/types/report'
import type { PaginatedResponse } from '~/types/pagination'
import DashboardHeader from '~/components/dashboard/header/DashboardHeader.vue'
import DashboardSummaryCards from '~/components/dashboard/summary/DashboardSummaryCards.vue'
import DashboardCharts from '~/components/dashboard/chart/DashboardCharts.vue'
import DashboardRecentExpenses from '~/components/dashboard/recent/DashboardRecentExpenses.vue'
import AppLoading from '~/components/common/AppLoading.vue'

definePageMeta({ layout: 'app' });

const api = useApi();

// ─── State ───────────────────────────────────────────
const loading = ref(true);
const summary = ref<SummaryReportResponse | null>(null);
const last12Months = ref<Array<MonthlyDataPoint>>([]);
const prevMonthSummary = ref<SummaryReportResponse | null>(null);
const recentExpenses = ref<Array<ExpenseResponse>>([]);

// ─── Helpers ─────────────────────────────────────────
type YearMonth = { year: number; month: number };

const MONTH_NAMES: Array<string> = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

function getMonthRange({ year, month }: YearMonth): { from: string; to: string } {
  const from = new Date(year, month - 1, 1);
  const to = new Date(year, month, 0);
  return {
    from: from.toISOString().split('T')[0]!,
    to: to.toISOString().split('T')[0]!,
  };
}

/**
 * Moves a (year, month) for N months.
 * Ex: shiftMonth({2026, 1}, -1) => {2025, 12}
 */
function shiftMonth({ year, month }: YearMonth, deltaMonths: number): YearMonth {
  const d: Date = new Date(year, month - 1 + deltaMonths, 1)
  return { year: d.getFullYear(), month: d.getMonth() + 1 }
}

/**
 * Returns the last N months including the given month, ordered from oldest to most recent.
 * Ex: getLastNMonths({2024, 6}, 3) => [{2024, 4}, {2024, 5}, {2024, 6}]
 */
function getLastNMonths(current: YearMonth, n: number): Array<YearMonth> {
  const months: Array<YearMonth> = []
  for (let i = n - 1; i >= 0; i--) {
    months.push(shiftMonth(current, -i))
  }
  return months
}

function yearMonthKey({ year, month }: YearMonth): string {
  return `${year}-${String(month).padStart(2, '0')}`
}


// ─── Computed ────────────────────────────────────────
const now: Date = new Date();
const current: YearMonth = {
  year: now.getFullYear(),
  month: now.getMonth() + 1
};

const currentMonthLabel = computed(() => {
  return `${MONTH_NAMES[current.month - 1]} ${current.year}`
});


// ─── API helpers ─────────────────────────────────────
async function fetchSummary(range: { from: string; to: string }): Promise<SummaryReportResponse> {
  const res = await api.get<SummaryReportResponse>('/reports/summary', { params: range });
  return res.data;
}

async function fetchRecentExpenses(): Promise<Array<ExpenseResponse>> {
  const res = await api.get<PaginatedResponse<ExpenseResponse>>('/expenses', { params: { page: 1, limit: 5 } });
  return res.data.data ?? [];
}

async function fetchMonthlyReport(year: number): Promise<MonthlyReportResponse> {
  const res = await api.get<MonthlyReportResponse>('/reports/monthly', { params: { year } });
  return res.data;
}

// ─── Fetch data ──────────────────────────────────────
onMounted(async () => {
  loading.value = true

  try {
    // 1) Target dates
    const prev: YearMonth = shiftMonth(current, -1);
    const currentRange = getMonthRange(current);
    const prevRange = getMonthRange(prev);

    // 2) List last 12 months (including current month)
    const targetMonths: Array<YearMonth> = getLastNMonths(current, 12);
    const targetKeys: Set<string> = new Set(targetMonths.map(yearMonthKey));

    // 3) Which months we need to fetch?
    const yearsToFetch = Array.from(new Set(targetMonths.map(m => m.year)))

    // 4) Fetch all data in parallel
    const [currentSummary, previousSummary, expenses, ...monthlyReports] = await Promise.all([
      fetchSummary(currentRange),
      fetchSummary(prevRange),
      fetchRecentExpenses(),
      ...yearsToFetch.map(fetchMonthlyReport),
    ])

    // 5) Set summaries
    summary.value = currentSummary
    prevMonthSummary.value = previousSummary

    // 6) Build monthly chart data (only target months)
    const points: Array<MonthlyDataPoint> = []
    for (const report of monthlyReports) {
      for (const m of report.months) {
        const ym: YearMonth = { year: report.year, month: m.month }
        if (targetKeys.has(yearMonthKey(ym))) {
          points.push({ year: ym.year, month: ym.month, totals: m.totals })
        }
      }
    }

    // Order from oldest to newest
    points.sort((a, b) => a.year - b.year || a.month - b.month)
    last12Months.value = points

    // 7) Last 5 expenses
    recentExpenses.value = expenses
  } catch (e) {
    console.error('Erro ao carregar dados do dashboard:', e)
  } finally {
    loading.value = false
  }
});
</script>
