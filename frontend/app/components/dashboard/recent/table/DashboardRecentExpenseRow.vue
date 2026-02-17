<template>
  <tr>
    <td>{{ formatDate(expense.spentAt) }}</td>
    <td>{{ expense.name }}</td>
    <td>
      <v-chip v-if="expense.category" size="small" variant="tonal" :color="expense.category.color ?? '#9E9E9E'">
        {{ expense.category.name }}
      </v-chip>
      <span v-else class="text-medium-emphasis">—</span>
    </td>
    <td class="text-end font-weight-medium">{{ formatCurrency(expense.amount) }}</td>
  </tr>
</template>

<script setup lang="ts">
import type { ExpenseResponse } from '~/types/expense'

const { formatCurrency } = useFormatCurrency();
const { formatDate } = useFormatDate();

defineProps<{
  expense: ExpenseResponse,
}>();
</script>
