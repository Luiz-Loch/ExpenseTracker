<template>
  <AppDialog
    v-model="dialog"
    :title="isEditing ? 'Editar transação' : 'Nova transação'"
    :max-width="560"
    persistent
  >
    <v-form ref="formRef" v-model="isValid" @submit.prevent="save">
      <!-- Type toggle -->
      <div class="mb-4 d-flex flex-column align-center">
        <div class="text-body-2 font-weight-medium mb-2 align-self-start">Tipo</div>
        <v-btn-toggle v-model="form.type" mandatory :color="form.type === ExpenseType.INCOME ? 'success' : 'error'" variant="outlined" class="ga-3">
          <v-btn :value="ExpenseType.EXPENSE" prepend-icon="mdi-arrow-down" rounded="lg">Despesa</v-btn>
          <v-btn :value="ExpenseType.INCOME" prepend-icon="mdi-arrow-up" rounded="lg">Receita</v-btn>
        </v-btn-toggle>
      </div>

      <!-- Name -->
      <v-text-field
        v-model="form.name"
        label="Nome"
        variant="outlined"
        density="comfortable"
        :rules="[rules.required, rules.min(2), rules.max(100)]"
        class="mb-1"
      />

      <!-- Category -->
      <v-select
        v-model="form.categoryId"
        :items="categoryItems"
        item-title="label"
        item-value="value"
        label="Categoria"
        variant="outlined"
        density="comfortable"
        clearable
        class="mb-1"
      />

      <!-- Amount -->
      <v-text-field
        v-model.number="form.amount"
        label="Valor"
        type="number"
        variant="outlined"
        density="comfortable"
        prefix="R$"
        :rules="[rules.required, rules.positiveNumber]"
        step="0.01"
        min="0.01"
        class="mb-1"
      />

      <!-- Date -->
      <v-text-field
        v-model="form.spentAt"
        label="Data"
        type="date"
        variant="outlined"
        density="comfortable"
        :rules="[rules.required]"
        class="mb-1"
      />

      <!-- Description -->
      <v-textarea
        v-model="form.description"
        label="Descrição (opcional)"
        variant="outlined"
        density="comfortable"
        rows="2"
        :rules="[rules.max(255)]"
        class="mb-1"
      />

      <v-alert v-if="error" type="error" variant="tonal" class="mb-3">
        {{ error }}
      </v-alert>

      <div class="d-flex justify-end ga-3 mt-2">
        <v-btn variant="outlined" @click="dialog = false">Cancelar</v-btn>
        <v-btn
          color="primary"
          type="submit"
          :loading="saving"
          :disabled="!isValid || saving"
        >
          {{ isEditing ? 'Salvar' : 'Criar' }}
        </v-btn>
      </div>
    </v-form>
  </AppDialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ExpenseType, type ExpenseResponse, type CreateExpenseRequest, type PatchExpenseRequest } from '~/types/expense'
import type { CategoryResponse } from '~/types/category'
import AppDialog from '~/components/common/AppDialog.vue'

const api = useApi();

const props = defineProps<{
  modelValue: boolean,
  expense: ExpenseResponse | null,
  categories: Array<CategoryResponse>,
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean],
  saved: [],
}>();

const dialog = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v),
});

const isEditing = computed(() => props.expense !== null);

// ─── Form State ──────────────────────────────────────
const formRef = ref();
const isValid = ref<boolean>(false);
const saving = ref<boolean>(false);
const error = ref<string | null>(null);

type FormData = {
  type: ExpenseType
  name: string
  categoryId: string | null
  amount: number | null
  spentAt: string
  description: string
}

const form = ref<FormData>(emptyForm());

function emptyForm(): FormData {
  return {
    type: ExpenseType.EXPENSE,
    name: '',
    categoryId: null,
    amount: null,
    spentAt: new Date().toISOString().split('T')[0]!,
    description: '',
  }
}

function toFormData(expense: ExpenseResponse): FormData {
  return {
    type: expense.type,
    name: expense.name,
    categoryId: expense.category?.id ?? null,
    amount: expense.amount,
    spentAt: new Date(expense.spentAt).toISOString().split('T')[0]!,
    description: expense.description ?? '',
  }
}

// Reset form when dialog opens
watch(dialog, (open) => {
  if (open) {
    error.value = null
    form.value = props.expense ? toFormData(props.expense) : emptyForm()
  }
});

// ─── Category Items ──────────────────────────────────
const categoryItems = computed(() =>
  props.categories.map(c => ({ label: c.name, value: c.id }))
);

// ─── Validation Rules ────────────────────────────────
const { rules } = useFormRules();

// ─── Actions ─────────────────────────────────────────
async function save() {
  error.value = null;
  saving.value = true;

  try {
    const spentAt = new Date(form.value.spentAt + 'T12:00:00').toISOString();

    if (isEditing.value) {
      const payload: PatchExpenseRequest = {
        name: form.value.name.trim(),
        type: form.value.type,
        amount: form.value.amount!,
        spentAt,
        categoryId: form.value.categoryId ?? null,
        description: form.value.description?.trim() || null,
      }
      await api.patch(`/expenses/${props.expense!.id}`, payload);
    } else {
      const payload: CreateExpenseRequest = {
        name: form.value.name.trim(),
        type: form.value.type,
        amount: form.value.amount!,
        spentAt,
      }
      if (form.value.categoryId) payload.categoryId = form.value.categoryId;
      if (form.value.description?.trim()) payload.description = form.value.description.trim();

      await api.post('/expenses', payload);
    }

    emit('saved');
  } catch (e: any) {
    const msg = e?.response?.data?.message;
    if (Array.isArray(msg) && msg.length > 0) {
      error.value = String(msg[0]);
    } else {
      error.value = 'Erro ao salvar transação. Tente novamente.';
    }
  } finally {
    saving.value = false;
  }
}
</script>
