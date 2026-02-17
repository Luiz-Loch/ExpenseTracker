<template>
  <v-card variant="outlined" rounded="lg" class="pa-5 mt-12 chart-card app-card">
    <div class="text-subtitle-1 font-weight-bold mb-4">Transações Recentes</div>
    <DashboardRecentExpenseTable v-if="expenses.length" :expenses="expenses" />
    <div v-else class="d-flex justify-center align-center" style="min-height: 120px">
      <span class="text-medium-emphasis">Nenhuma transação encontrada</span>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import type { ExpenseResponse } from '~/types/expense'
import DashboardRecentExpenseTable from './table/DashboardRecentExpenseTable.vue'

defineProps<{
  expenses: Array<ExpenseResponse>,
}>();
</script>
