<template>
  <DashboardSummaryCard
    title="Maior Categoria"
    :value="topCategory?.name ?? '—'"
    icon="mdi-tag-outline"
  >
    <div class="text-caption text-medium-emphasis mt-1">
      {{ topCategory ? `${formatCurrency(topCategory.expense)} (${topCategory.percent}%)` : 'Sem dados' }}
    </div>
  </DashboardSummaryCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DashboardSummaryCard from '../base/DashboardSummaryCard.vue'
import type { CategoryItemResponse, SummaryReportResponse } from '~/types/report'

const { formatCurrency } = useFormatCurrency()

const props = defineProps<{
  summary: SummaryReportResponse | null
}>();

type CategoryWithData = CategoryItemResponse & {
  category: NonNullable<CategoryItemResponse['category']>
}

function hasCategory(item: CategoryItemResponse): item is CategoryWithData {
  return item.category !== null;
}

function calcPercent(expense: number, total: number): number {
  return Math.round((expense / (total || 1)) * 100);
}

const topCategory = computed(() => {
  const categories: Array<CategoryItemResponse> | undefined = props.summary?.byCategory;
  if (!categories?.length) return null;

  const sorted: Array<CategoryWithData> = categories.filter(hasCategory).sort((a, b) => b.totals.expense - a.totals.expense);
  const top: CategoryWithData | undefined = sorted[0];
  if (!top) return null;

  return {
    name: top.category.name,
    expense: top.totals.expense,
    percent: calcPercent(top.totals.expense, props.summary!.totals.expense),
  };
})
</script>
