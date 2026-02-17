<template>
  <ExpensesSummaryCard
    title="Despesas"
    :value="formatCurrency(expense)"
    icon="mdi-trending-down"
    value-class="text-red"
  />
</template>

<script setup lang="ts">
import ExpensesSummaryCard from '../base/ExpensesSummaryCard.vue'

const { formatCurrency } = useFormatCurrency();

defineProps<{
  expense: number,
}>();
</script>
