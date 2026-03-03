<template>
  <div>
    <CategoriesHeader @create="openCreate" />

    <CategoriesFilters v-model:search="search" />

    <AppLoading v-if="loading" />

    <CategoriesTable
      v-else
      :categories="filteredCategories"
      :total-items="total"
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

const categoryService = useCategoryService();
const { snackbar, showSnackbar, SnackbarColor } = useSnackbar();

// ─── Filters ─────────────────────────────────────────
const search = ref<string>('');

// ─── Dialogs ─────────────────────────────────────────
const formDialog = ref<boolean>(false);
const deleteDialog = ref<boolean>(false);
const editingCategory = ref<CategoryResponse | null>(null);
const deletingCategory = ref<CategoryResponse | null>(null);

// ─── Server-Side Pagination ──────────────────────────
const { items: categories, currentPage, itemsPerPage, total, loading, fetchPage } = usePagination<CategoryResponse>(
  async (page: number, limit: number) => {
    const res = await categoryService.list({ page, limit });
    return res.data;
  },
);

// ─── Local Search Filter (current page) ──────────────
const filteredCategories = computed(() => {
  const query: string = search.value.trim().toLowerCase();
  if (!query) return categories.value;
  return categories.value.filter(c => c.name.toLowerCase().includes(query));
});

// Reset to page 1 on filter change
watch(
  () => search.value.trim(),
  () => {
    if (currentPage.value !== 1) {
      currentPage.value = 1;
    }
  },
  { flush: 'sync' },
);

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
  await fetchPage();
}

async function onDeleteConfirmed(): Promise<void> {
  if (!deletingCategory.value) {
    return;
  }
  try {
    await categoryService.remove(deletingCategory.value.id);
    deleteDialog.value = false;
    showSnackbar('Categoria excluída com sucesso');
    await fetchPage();
  } catch (e) {
    console.error('Erro ao excluir categoria:', e);
    showSnackbar('Erro ao excluir categoria', SnackbarColor.ERROR);
  }
}

// ─── Init ────────────────────────────────────────────
onMounted(fetchPage);
</script>
