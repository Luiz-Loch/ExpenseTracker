<template>
  <v-row class="mb-6">
    <v-col cols="12" sm="6" md="3">
      <ExpensesTotalCountCard :count="count" />
    </v-col>
    <v-col cols="12" sm="6" md="3">
      <ExpensesIncomeCard :income="income" />
    </v-col>
    <v-col cols="12" sm="6" md="3">
      <ExpensesExpenseCard :expense="expense" />
    </v-col>
    <v-col cols="12" sm="6" md="3">
      <ExpensesBalanceCard :balance="balance" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import ExpensesTotalCountCard from './cards/ExpensesTotalCountCard.vue'
import ExpensesIncomeCard from './cards/ExpensesIncomeCard.vue'
import ExpensesExpenseCard from './cards/ExpensesExpenseCard.vue'
import ExpensesBalanceCard from './cards/ExpensesBalanceCard.vue'

defineProps<{
  count: number,
  income: number,
  expense: number,
  balance: number,
}>();
</script>
