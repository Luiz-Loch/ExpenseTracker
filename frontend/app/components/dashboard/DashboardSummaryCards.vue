<template>
  <v-row class="mb-2">
    <!-- Total expense -->
    <v-col cols="12" md="4">
      <DashboardTotalExpenseCard
        :total-expense="summary?.totals?.expense ?? 0"
        :prev-total-expense="prevSummary?.totals?.expense ?? 0"
        :month-label="monthLabel"
      />
    </v-col>

    <!-- Balance -->
    <v-col cols="12" md="4">
      <DashboardBalanceCard
        :balance="summary?.totals?.balance ?? 0"
        :total-income="summary?.totals?.income ?? 0"
        :currency="summary?.currency ?? Currency.BRL"
      />
    </v-col>

    <!-- Top Category -->
    <v-col cols="12" md="4">
      <DashboardTopCategoryCard :summary="summary" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { SummaryReportResponse } from '~/types/report'
import DashboardTotalExpenseCard from './summary/cards/DashboardTotalExpenseCard.vue'
import DashboardBalanceCard from './summary/cards/DashboardBalanceCard.vue'
import DashboardTopCategoryCard from './summary/cards/DashboardTopCategoryCard.vue'
import { Currency } from '~/types/expense';


defineProps<{
  summary: SummaryReportResponse | null,
  prevSummary: SummaryReportResponse | null,
  monthLabel: string,
}>();
</script>
