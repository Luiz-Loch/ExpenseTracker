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
      :expenses="paginatedExpenses"
      :total-items="filteredExpenses.length"
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

const api = useApi();
const { snackbar, showSnackbar, SnackbarColor } = useSnackbar();

// ─── State ───────────────────────────────────────────
const loading = ref<boolean>(true);
const allExpenses = ref<Array<ExpenseResponse>>([]);
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

// ─── Derived: sorted + filtered + totals ─────────────
const sortedExpenses = computed(() => {
  return [...allExpenses.value].sort((a, b) => +new Date(b.spentAt) - +new Date(a.spentAt))
});

const filteredExpenses = computed(() => {
  let result: Array<ExpenseResponse> = sortedExpenses.value

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

// Pagination
const { currentPage, itemsPerPage, paginatedItems: paginatedExpenses, resetPage } = usePagination(filteredExpenses);

// Reset page on filter change
watch(
  () => [search.value.trim(), period.value, categoryFilter.value],
  () => { resetPage() },
  { flush: 'sync' },
);

// ─── API ─────────────────────────────────────────────
async function fetchData(): Promise<void> {
  loading.value = true
  try {
    const [expensesRes, categoriesRes] = await Promise.all([
      api.get<Array<ExpenseResponse>>('/expenses'),
      api.get<Array<CategoryResponse>>('/categories'),
    ]);
    allExpenses.value = expensesRes.data;
    categories.value = categoriesRes.data;
  } catch (e) {
    console.error('Erro ao carregar transações:', e);
    showSnackbar('Erro ao carregar transações', SnackbarColor.ERROR);
  } finally {
    loading.value = false;
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
  await fetchData();
}

async function onDeleteConfirmed(): Promise<void> {
  if (!deletingExpense.value) {
    return;
  }
  try {
    await api.delete(`/expenses/${deletingExpense.value.id}`);
    deleteDialog.value = false;
    showSnackbar('Transação excluída com sucesso');
    await fetchData();
  } catch (e) {
    console.error('Erro ao excluir transação:', e);
    showSnackbar('Erro ao excluir transação', SnackbarColor.ERROR);
  }
}

// ─── Init ────────────────────────────────────────────
onMounted(fetchData);
</script>
