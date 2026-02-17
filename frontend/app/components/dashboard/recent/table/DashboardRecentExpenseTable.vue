<template>
  <v-table>
    <thead>
      <tr>
        <th class="text-uppercase text-caption font-weight-bold">Data</th>
        <th class="text-uppercase text-caption font-weight-bold">Descrição</th>
        <th class="text-uppercase text-caption font-weight-bold">Categoria</th>
        <th class="text-uppercase text-caption font-weight-bold text-end">Valor</th>
      </tr>
    </thead>
    <tbody>
      <DashboardRecentExpenseRow
        v-for="expense in expenses"
        :key="expense.id"
        :expense="expense"
      />
    </tbody>
  </v-table>
</template>

<script setup lang="ts">
import type { ExpenseResponse } from '~/types/expense'
import DashboardRecentExpenseRow from './DashboardRecentExpenseRow.vue'

defineProps<{
  expenses: Array<ExpenseResponse>,
}>();
</script>
