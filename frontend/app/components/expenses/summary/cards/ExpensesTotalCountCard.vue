<template>
  <ExpensesSummaryCard
    title="Total de Transações"
    :value="String(count)"
    icon="mdi-format-list-numbered"
  />
</template>

<script setup lang="ts">
import ExpensesSummaryCard from '../base/ExpensesSummaryCard.vue'

defineProps<{
  count: number,
}>();
</script>
