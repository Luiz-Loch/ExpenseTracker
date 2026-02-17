<template>
  <DashboardChartCard title="Gastos por Categoria" :has-data="hasData" class="summary-card">
    <Bar :data="chartData" :options="chartOptions" />
  </DashboardChartCard>
</template>

<script setup lang="ts">
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  type TooltipItem,
  type ChartOptions,
} from 'chart.js'
import { Bar } from 'vue-chartjs'
import type { CategoryItemResponse, SummaryReportResponse } from '~/types/report'
import DashboardChartCard from '../base/DashboardChartCard.vue'
import { CHART_COLORS, createDefaultScales } from '../chart.constants'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const { formatCurrency } = useFormatCurrency();

const props = defineProps<{
  summary: SummaryReportResponse | null,
}>()

// ─── Helpers ─────────────────────────────────────────
const MAX_CATEGORIES = 6;

type CategoryWithData = CategoryItemResponse & {
  category: NonNullable<CategoryItemResponse['category']>
}

function hasCategory(item: CategoryItemResponse): item is CategoryWithData {
  return item.category !== null
}

function tooltipLabel(ctx: TooltipItem<'bar'>): string {
  return formatCurrency(Number(ctx.parsed.y))
}

// ─── Computed ────────────────────────────────────────
const categoryItems = computed(() => {
  const categories: Array<CategoryItemResponse> = props.summary?.byCategory ?? [];
  return categories
    .filter(hasCategory)
    .filter((i) => i.totals.expense > 0)
    .sort((a, b) => b.totals.expense - a.totals.expense)
    .slice(0, MAX_CATEGORIES)
});

const hasData = computed(() => categoryItems.value.length > 0);

const chartData = computed(() => {
  const items: Array<CategoryWithData> = categoryItems.value
  return {
    labels: items.map((i) => i.category.name),
    datasets: [
      {
        label: 'Gastos',
        data: items.map((i) => i.totals.expense),
        backgroundColor: CHART_COLORS.primary,
        borderRadius: 4,
        maxBarThickness: 48,
      },
    ],
  }
});

const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: { label: tooltipLabel },
    },
  },
  scales: createDefaultScales(),
};
</script>
