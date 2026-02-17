<template>
  <ExpensesSummaryCard
    title="Saldo"
    :value="formatCurrency(balance)"
    icon="mdi-scale-balance"
  />
</template>

<script setup lang="ts">
import ExpensesSummaryCard from '../base/ExpensesSummaryCard.vue'

const { formatCurrency } = useFormatCurrency();

defineProps<{
  balance: number,
}>();
</script>
