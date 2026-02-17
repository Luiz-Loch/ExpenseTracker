<template>
  <div>
    <CategoriesHeader @create="openCreate" />

    <CategoriesFilters v-model:search="search" />

    <AppLoading v-if="loading" />

    <CategoriesTable
      v-else
      :categories="paginatedCategories"
      :total-items="filteredCategories.length"
      v-model:current-page="currentPage"
      :items-per-page="itemsPerPage"
      @edit="openEdit"
      @delete="openDelete"
    />

    <!-- Form Dialog -->
    <CategoryFormDialog
      v-model="formDialog"
      :category="editingCategory"
      @saved="onSaved"
    />

    <!-- Delete Dialog -->
    <CategoryDeleteDialog
      v-model="deleteDialog"
      :category="deletingCategory"
      @confirmed="onDeleteConfirmed"
    />

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.open" :color="snackbar.color" :timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { CategoryResponse } from '~/types/category'
import CategoriesHeader from '~/components/categories/header/CategoriesHeader.vue'
import CategoriesFilters from '~/components/categories/filter/CategoriesFilters.vue'
import CategoriesTable from '~/components/categories/table/CategoriesTable.vue'
import CategoryFormDialog from '~/components/categories/dialog/CategoryFormDialog.vue'
import CategoryDeleteDialog from '~/components/categories/dialog/CategoryDeleteDialog.vue'
import AppLoading from '~/components/common/AppLoading.vue'

definePageMeta({ layout: 'app' });

const api = useApi();
const { snackbar, showSnackbar, SnackbarColor } = useSnackbar();

// ─── State ───────────────────────────────────────────
const loading = ref<boolean>(true);
const allCategories = ref<Array<CategoryResponse>>([]);

// Filters
const search = ref<string>('');

// Dialogs
const formDialog = ref<boolean>(false);
const deleteDialog = ref<boolean>(false);
const editingCategory = ref<CategoryResponse | null>(null);
const deletingCategory = ref<CategoryResponse | null>(null);

// ─── Derived: sorted + filtered ──────────────────────
const sortedCategories = computed(() => {
  return [...allCategories.value].sort((a, b) => a.name.localeCompare(b.name))
});

const filteredCategories = computed(() => {
  let result: Array<CategoryResponse> = sortedCategories.value

  const query: string = search.value.trim().toLowerCase();
  if (query) {
    result = result.filter(c => c.name.toLowerCase().includes(query))
  }

  return result;
});

// Pagination
const { currentPage, itemsPerPage, paginatedItems: paginatedCategories, resetPage } = usePagination(filteredCategories);

// Reset page on filter change
watch(
  () => search.value.trim(),
  () => { resetPage() },
  { flush: 'sync' },
);

// ─── API ─────────────────────────────────────────────
async function fetchData(): Promise<void> {
  loading.value = true;
  try {
    const res = await api.get<Array<CategoryResponse>>('/categories');
    allCategories.value = res.data;
  } catch (e) {
    console.error('Erro ao carregar categorias:', e);
    showSnackbar('Erro ao carregar categorias', SnackbarColor.ERROR);
  } finally {
    loading.value = false;
  }
}

// ─── Dialog Actions ──────────────────────────────────
function openCreate(): void {
  editingCategory.value = null;
  formDialog.value = true;
}

function openEdit(category: CategoryResponse): void {
  editingCategory.value = category;
  formDialog.value = true;
}

function openDelete(category: CategoryResponse): void {
  deletingCategory.value = category;
  deleteDialog.value = true;
}

async function onSaved(): Promise<void> {
  const wasEditing = editingCategory.value !== null;
  formDialog.value = false;
  showSnackbar(wasEditing ? 'Categoria atualizada com sucesso' : 'Categoria criada com sucesso');
  await fetchData();
}

async function onDeleteConfirmed(): Promise<void> {
  if (!deletingCategory.value) {
    return;
  }
  try {
    await api.delete(`/categories/${deletingCategory.value.id}`);
    deleteDialog.value = false;
    showSnackbar('Categoria excluída com sucesso');
    await fetchData();
  } catch (e) {
    console.error('Erro ao excluir categoria:', e);
    showSnackbar('Erro ao excluir categoria', SnackbarColor.ERROR);
  }
}

// ─── Init ────────────────────────────────────────────
onMounted(fetchData);
</script>
