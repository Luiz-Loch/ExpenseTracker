<template>
  <v-card variant="outlined" rounded="lg" class="app-card">
    <v-table>
      <thead>
        <tr>
          <th class="text-uppercase text-caption font-weight-bold">Data</th>
          <th class="text-uppercase text-caption font-weight-bold">Descrição</th>
          <th class="text-uppercase text-caption font-weight-bold">Categoria</th>
          <th class="text-uppercase text-caption font-weight-bold text-end">Valor</th>
          <th class="text-uppercase text-caption font-weight-bold text-center">Ações</th>
        </tr>
      </thead>
      <tbody>
        <AppTableEmptyRow
          v-if="expenses.length === 0"
          message="Nenhuma transação encontrada"
          :colspan="5"
        />
        <ExpensesTableRow
          v-for="expense in expenses"
          :key="expense.id"
          :expense="expense"
          @edit="$emit('edit', $event)"
          @delete="$emit('delete', $event)"
        />
      </tbody>
    </v-table>

    <AppPagination
      v-model:current-page="page"
      :total-items="totalItems"
      :items-per-page="itemsPerPage"
    />
  </v-card>
</template>

<script setup lang="ts">
import type { ExpenseResponse } from '~/types/expense'
import ExpensesTableRow from './ExpensesTableRow.vue'
import AppPagination from '~/components/common/AppPagination.vue'
import AppTableEmptyRow from '~/components/common/AppTableEmptyRow.vue'

defineProps<{
  expenses: Array<ExpenseResponse>,
  totalItems: number,
  itemsPerPage: number,
}>();

defineEmits<{
  edit: [expense: ExpenseResponse],
  delete: [expense: ExpenseResponse],
}>();

const page = defineModel<number>('currentPage', { required: true });
</script>
