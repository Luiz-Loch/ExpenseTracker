<template>
  <DashboardSummaryCard
    title="Saldo do Mês"
    :value="formatCurrency(balance, currency)"
    icon="mdi-chart-line-variant"
  >
    <div class="text-caption text-medium-emphasis mt-1">
      Receita: {{ formatCurrency(totalIncome, currency) }}
    </div>
  </DashboardSummaryCard>
</template>

<script setup lang="ts">
import type { Currency } from '~/types/expense';
import DashboardSummaryCard from '../base/DashboardSummaryCard.vue'

const { formatCurrency } = useFormatCurrency()

defineProps<{
  balance: number,
  totalIncome: number,
  currency: Currency
}>();
</script>
