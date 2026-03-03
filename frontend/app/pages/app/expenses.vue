<template>
  <div>
    <ExpensesHeader @create="openCreate" />

    <ExpensesFilters
      v-model:search="search"
      v-model:period="period"
      v-model:category="categoryFilter"
      :categories="categories"
    />

    <ExpensesSummaryCards
      :count="filteredExpenses.length"
      :income="totals.income"
      :expense="totals.expense"
      :balance="totals.balance"
    />

    <AppLoading v-if="loading" />

    <ExpensesTable
      v-else
      :expenses="filteredExpenses"
      :total-items="total"
      v-model:current-page="currentPage"
      :items-per-page="itemsPerPage"
      @edit="openEdit"
      @delete="openDelete"
    />

    <!-- Form Dialog -->
    <ExpenseFormDialog
      v-model="formDialog"
      :expense="editingExpense"
      :categories="categories"
      @saved="onSaved"
    />

    <!-- Delete Dialog -->
    <ExpenseDeleteDialog
      v-model="deleteDialog"
      :expense="deletingExpense"
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
import { ExpenseType, Period, type ExpenseResponse } from '~/types/expense'
import type { CategoryResponse } from '~/types/category'
import ExpensesHeader from '~/components/expenses/header/ExpensesHeader.vue'
import ExpensesFilters from '~/components/expenses/filter/ExpensesFilters.vue'
import ExpensesSummaryCards from '~/components/expenses/summary/ExpensesSummaryCards.vue'
import ExpensesTable from '~/components/expenses/table/ExpensesTable.vue'
import ExpenseFormDialog from '~/components/expenses/dialog/ExpenseFormDialog.vue'
import ExpenseDeleteDialog from '~/components/expenses/dialog/ExpenseDeleteDialog.vue'
import AppLoading from '~/components/common/AppLoading.vue'

definePageMeta({ layout: 'app' });

const expenseService = useExpenseService();
const categoryService = useCategoryService();
const { snackbar, showSnackbar, SnackbarColor } = useSnackbar();

// ─── State ───────────────────────────────────────────
const categories = ref<Array<CategoryResponse>>([]);

// Filters
const search = ref<string>('');
const period = ref<Period>(Period.ALL)
const categoryFilter = ref<'all' | string>('all')

// Dialogs
const formDialog = ref<boolean>(false);
const deleteDialog = ref<boolean>(false);
const editingExpense = ref<ExpenseResponse | null>(null);
const deletingExpense = ref<ExpenseResponse | null>(null);

// ─── Server-Side Pagination ──────────────────────────
const { items: expenses, currentPage, itemsPerPage, total, loading, fetchPage } = usePagination<ExpenseResponse>(
  async (page: number, limit: number) => {
    const res = await expenseService.list({ page, limit });
    return res.data;
  },
);

// ─── Period Range Helper ─────────────────────────────
function getPeriodRange(period: Period): { from: Date | null; to: Date } {
  const now: Date = new Date();
  const to: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  const startOfDay = (date: Date) => {
    const start = new Date(date)
    start.setHours(0, 0, 0, 0)
    return start
  }

  switch (period) {
    case Period.LAST_7_DAYS: {
      const from = startOfDay(to);
      from.setDate(from.getDate() - 6);
      return { from, to };
    }
    case Period.LAST_30_DAYS: {
      const from = startOfDay(to);
      from.setDate(from.getDate() - 29);
      return { from, to };
    }
    case Period.THIS_MONTH: {
      const from = new Date(now.getFullYear(), now.getMonth(), 1);
      return { from, to };
    }
    case Period.LAST_MONTH: {
      const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      return { from, to: end };
    }
    case Period.LAST_3_MONTHS: {
      const from = startOfDay(to);
      from.setMonth(from.getMonth() - 3);
      return { from, to };
    }
    case Period.THIS_YEAR: {
      const from = new Date(now.getFullYear(), 0, 1);
      return { from, to };
    }
    case Period.ALL:
    default:
      return { from: null, to };
  }
}

// ─── Local Filters (applied to current page data) ────
const filteredExpenses = computed(() => {
  let result: Array<ExpenseResponse> = expenses.value

  // Search
  const query: string = search.value.trim().toLowerCase();
  if (query) {
    result = result.filter(e => {
      const name = e.name?.toLowerCase() ?? '';
      const desc = e.description?.toLowerCase() ?? '';
      return name.includes(query) || desc.includes(query);
    })
  }

  // Period
  const { from, to } = getPeriodRange(period.value);
  if (from) {
    result = result.filter(e => {
      const d = new Date(e.spentAt);
      return d >= from && d <= to;
    });
  }

  // Category
  if (categoryFilter.value === 'none') {
    result = result.filter(e => !e.category);
  } else if (categoryFilter.value !== 'all') {
    result = result.filter(e => e.category?.id === categoryFilter.value);
  }

  return result;
});

const totals = computed(() => {
  let income = 0;
  let expense = 0;

  for (const e of filteredExpenses.value) {
    if (e.type === ExpenseType.INCOME) income += e.amount;
    else if (e.type === ExpenseType.EXPENSE) expense += e.amount;
  }

  return { income, expense, balance: income - expense };
});

// Reset to page 1 on filter change
watch(
  () => [search.value.trim(), period.value, categoryFilter.value],
  () => {
    if (currentPage.value !== 1) {
      currentPage.value = 1;
    }
  },
  { flush: 'sync' },
);

// ─── API ─────────────────────────────────────────────
async function fetchCategories(): Promise<void> {
  try {
    const res = await categoryService.list({ page: 1, limit: 100 });
    categories.value = res.data.data;
  } catch (e) {
    console.error('Erro ao carregar categorias:', e);
  }
}

// ─── Dialog Actions ──────────────────────────────────
function openCreate(): void {
  editingExpense.value = null;
  formDialog.value = true;
}

function openEdit(expense: ExpenseResponse): void {
  editingExpense.value = expense;
  formDialog.value = true;
}

function openDelete(expense: ExpenseResponse): void {
  deletingExpense.value = expense;
  deleteDialog.value = true;
}

async function onSaved(): Promise<void> {
  const wasEditing = editingExpense.value !== null;
  formDialog.value = false;
  showSnackbar(wasEditing ? 'Transação atualizada com sucesso' : 'Transação criada com sucesso');
  await fetchPage();
}

async function onDeleteConfirmed(): Promise<void> {
  if (!deletingExpense.value) {
    return;
  }
  try {
    await expenseService.remove(deletingExpense.value.id);
    deleteDialog.value = false;
    showSnackbar('Transação excluída com sucesso');
    await fetchPage();
  } catch (e) {
    console.error('Erro ao excluir transação:', e);
    showSnackbar('Erro ao excluir transação', SnackbarColor.ERROR);
  }
}

// ─── Init ────────────────────────────────────────────
onMounted(async () => {
  await Promise.all([fetchPage(), fetchCategories()]);
});
</script>
