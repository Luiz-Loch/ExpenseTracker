<template>
  <v-card variant="outlined" rounded="lg" class="summary-card">
    <v-table>
      <thead>
        <tr>
          <th class="text-uppercase text-caption font-weight-bold">Nome</th>
          <th class="text-uppercase text-caption font-weight-bold">Cor</th>
          <th class="text-uppercase text-caption font-weight-bold">Criada em</th>
          <th class="text-uppercase text-caption font-weight-bold text-center">Ações</th>
        </tr>
      </thead>
      <tbody>
        <AppTableEmptyRow
          v-if="categories.length === 0"
          message="Nenhuma categoria encontrada"
          :colspan="4"
        />
        <CategoriesTableRow
          v-for="category in categories"
          :key="category.id"
          :category="category"
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
import type { CategoryResponse } from '~/types/category'
import CategoriesTableRow from './CategoriesTableRow.vue'
import AppPagination from '~/components/common/AppPagination.vue'
import AppTableEmptyRow from '~/components/common/AppTableEmptyRow.vue'

defineProps<{
  categories: Array<CategoryResponse>,
  totalItems: number,
  itemsPerPage: number,
}>();

defineEmits<{
  edit: [category: CategoryResponse],
  delete: [category: CategoryResponse],
}>();

const page = defineModel<number>('currentPage', { required: true });
</script>
