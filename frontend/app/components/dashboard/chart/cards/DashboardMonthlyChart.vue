<template>
  <DashboardChartCard title="Evolução Mensal" :has-data="hasData" class="summary-card">
    <Line :data="chartData" :options="chartOptions" />
  </DashboardChartCard>
</template>

<script setup lang="ts">
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  type TooltipItem,
  type ChartOptions,
} from 'chart.js'
import { Line } from 'vue-chartjs'
import type { MonthlyItemResponse } from '~/types/report'
import DashboardChartCard from '../base/DashboardChartCard.vue'
import { CHART_COLORS, createDefaultScales } from '../chart.constants'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const { formatCurrency } = useFormatCurrency();

export type MonthlyDataPoint = {
  year: number,
  month: number,
  totals: MonthlyItemResponse['totals'],
};

const props = defineProps<{
  months: Array<MonthlyDataPoint>
}>();

// ─── Helpers ─────────────────────────────────────────
const SHORT_MONTH_NAMES = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
];

function formatMonthLabel(p: MonthlyDataPoint): string {
  const m = SHORT_MONTH_NAMES[p.month - 1] ?? '??'
  const yy = String(p.year).slice(2)
  return `${m}/${yy}`
}

function tooltipLabel(ctx: TooltipItem<'line'>): string {
  return formatCurrency(Number(ctx.parsed.y))
}


// ─── Computed ────────────────────────────────────────
const sortedMonths = computed(() => {
  // Sorting by year/month to ensure correct order even if API returns unordered
  return [...props.months].sort((a, b) => a.year - b.year || a.month - b.month)
})

const hasData = computed(() => sortedMonths.value.length > 0);

const labels = computed(() => sortedMonths.value.map(formatMonthLabel));
const expenses = computed(() => sortedMonths.value.map((p) => p.totals.expense));

const chartData = computed(() => {
  if (!hasData.value) return { labels: [] as string[], datasets: [] }

  return {
    labels: labels.value,
    datasets: [
      {
        label: 'Gastos',
        data: expenses.value,
        borderColor: CHART_COLORS.primary,
        backgroundColor: CHART_COLORS.primaryFill,
        pointBackgroundColor: CHART_COLORS.primary,
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.3,
        fill: true,
      },
    ],
  }
});

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { callbacks: { label: tooltipLabel } },
  },
  scales: createDefaultScales(),
};
</script>
