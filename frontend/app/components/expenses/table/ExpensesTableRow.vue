<template>
  <tr>
    <td class="text-no-wrap">{{ formatDate(expense.spentAt) }}</td>
    <td>{{ expense.name }}</td>
    <td>
      <v-chip
        v-if="expense.category"
        size="small"
        variant="tonal"
        :color="expense.category.color"
      >
        {{ expense.category.name }}
      </v-chip>
      <span v-else class="text-medium-emphasis">—</span>
    </td>
    <td
      class="text-end font-weight-medium text-no-wrap"
      :class="expense.type === ExpenseType.INCOME ? 'text-green' : ''"
    >
      {{ expense.type === ExpenseType.INCOME ? '+ ' : '- ' }}{{ formatCurrency(expense.amount) }}
    </td>
    <td class="text-center">
      <v-btn icon variant="text" size="small" @click="$emit('edit', expense)">
        <v-icon size="20">mdi-pencil-outline</v-icon>
      </v-btn>
      <v-btn icon variant="text" size="small" color="error" @click="$emit('delete', expense)">
        <v-icon size="20">mdi-trash-can-outline</v-icon>
      </v-btn>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { ExpenseType, type ExpenseResponse } from '~/types/expense'

const { formatCurrency } = useFormatCurrency();
const { formatDate } = useFormatDate();

defineProps<{
  expense: ExpenseResponse,
}>();

defineEmits<{
  edit: [expense: ExpenseResponse],
  delete: [expense: ExpenseResponse],
}>();
</script>
