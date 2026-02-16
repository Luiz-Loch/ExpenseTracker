<template>
  <DashboardSummaryCard
    title="Total Gasto"
    :value="formatCurrency(totalExpense)"
    icon="mdi-file-document-outline"
  >
    <div class="text-caption text-medium-emphasis mt-1">{{ monthLabel }}</div>
    <div
      v-if="percentChange !== null"
      class="text-caption mt-1"
      :class="percentChange > 0 ? 'text-red' : 'text-green'"
    >
      {{ percentChange > 0 ? '↑' : '↓' }} {{ Math.abs(percentChange) }}% comparado ao mês anterior
    </div>
  </DashboardSummaryCard>
</template>

<script setup lang="ts">
import DashboardSummaryCard from '../base/DashboardSummaryCard.vue'

const { formatCurrency } = useFormatCurrency()

const props = defineProps<{
  totalExpense: number,
  prevTotalExpense: number,
  monthLabel: string,
}>();

const percentChange = computed(() => {
  if (props.prevTotalExpense === 0) {
    return null;
  }
  return Math.round(((props.totalExpense - props.prevTotalExpense) / props.prevTotalExpense) * 100);
})
</script>
