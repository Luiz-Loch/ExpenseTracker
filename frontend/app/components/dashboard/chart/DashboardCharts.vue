<template>
  <v-row>
    <v-col cols="12" md="6">
      <DashboardCategoryChart :summary="summary" />
    </v-col>
    <v-col cols="12" md="6">
      <DashboardMonthlyChart :months="months" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { SummaryReportResponse } from '~/types/report'
import DashboardCategoryChart from './cards/DashboardCategoryChart.vue';
import DashboardMonthlyChart, { type MonthlyDataPoint } from './cards/DashboardMonthlyChart.vue';

defineProps<{
  summary: SummaryReportResponse | null,
  months: Array<MonthlyDataPoint>,
}>();
</script>
