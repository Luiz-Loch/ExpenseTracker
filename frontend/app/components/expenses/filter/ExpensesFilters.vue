<template>
  <v-card variant="outlined" rounded="lg" class="pa-5 mb-6 app-card">
    <v-row>
      <v-col cols="12" md="6">
        <div class="text-body-2 font-weight-medium mb-2">Buscar</div>
        <v-text-field
          v-model="search"
          placeholder="Buscar por descrição..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="comfortable"
          hide-details
          clearable
        />
      </v-col>
      <v-col cols="12" md="3">
        <div class="text-body-2 font-weight-medium mb-2">Período</div>
        <v-select
          v-model="period"
          :items="PERIOD_OPTIONS"
          item-title="label"
          item-value="value"
          variant="outlined"
          density="comfortable"
          hide-details
          prepend-inner-icon="mdi-calendar"
        />
      </v-col>
      <v-col cols="12" md="3">
        <div class="text-body-2 font-weight-medium mb-2">Categoria</div>
        <v-select
          v-model="category"
          :items="categoryItems"
          item-title="label"
          item-value="value"
          variant="outlined"
          density="comfortable"
          hide-details
          prepend-inner-icon="mdi-filter-variant"
        />
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { Period } from '~/types/expense'
import type { CategoryResponse } from '~/types/category'

const props = defineProps<{
  categories: Array<CategoryResponse>,
}>();

const search = defineModel<string>('search', { default: '' });
const period = defineModel<Period>('period', { default: Period.ALL });
const category = defineModel<string>('category', { default: 'all' });

const PERIOD_OPTIONS: ReadonlyArray<{ label: string; value: Period }> = [
  { label: 'Últimos 7 dias', value: Period.LAST_7_DAYS },
  { label: 'Últimos 30 dias', value: Period.LAST_30_DAYS },
  { label: 'Este mês', value: Period.THIS_MONTH },
  { label: 'Último mês', value: Period.LAST_MONTH },
  { label: 'Últimos 3 meses', value: Period.LAST_3_MONTHS },
  { label: 'Este ano', value: Period.THIS_YEAR },
  { label: 'Todos', value: Period.ALL },
];

const categoryItems = computed(() => {
  const items: Array<{ label: string; value: string }> = [
    { label: 'Todas', value: 'all' },
    { label: 'Sem categoria', value: 'none' },
  ];
  for (const cat of props.categories) {
    items.push({ label: cat.name, value: cat.id });
  }
  return items;
})
</script>
