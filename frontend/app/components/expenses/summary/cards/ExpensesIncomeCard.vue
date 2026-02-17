<template>
  <ExpensesSummaryCard
    title="Receitas"
    :value="formatCurrency(income)"
    icon="mdi-trending-up"
    value-class="text-green"
  />
</template>

<script setup lang="ts">
import ExpensesSummaryCard from '../base/ExpensesSummaryCard.vue'

const { formatCurrency } = useFormatCurrency();

defineProps<{
  income: number,
}>();
</script>
