<template>
  <AppDialog
    v-model="dialog"
    :title="isEditing ? 'Editar categoria' : 'Nova categoria'"
    :max-width="480"
    persistent
  >
    <v-form ref="formRef" v-model="isValid" @submit.prevent="save">
      <!-- Name -->
      <v-text-field
        v-model="form.name"
        label="Nome"
        variant="outlined"
        density="comfortable"
        :rules="[rules.required, rules.min(2), rules.max(100)]"
        class="mb-3"
      />

      <!-- Color -->
      <div class="mb-4">
        <div class="d-flex align-center justify-space-between mb-2">
          <span class="text-body-2 font-weight-medium">Cor</span>
          <v-btn
            v-if="form.color !== null"
            variant="text"
            size="small"
            color="error"
            @click="form.color = null"
          >
            Remover cor
          </v-btn>
        </div>
        <div v-if="form.color !== null" class="d-flex align-center ga-3">
          <v-menu :close-on-content-click="false">
            <template #activator="{ props: menuProps }">
              <v-btn
                v-bind="menuProps"
                variant="outlined"
                rounded="lg"
                class="color-preview-btn"
              >
                <div
                  class="rounded-circle mr-2"
                  :style="{ width: '24px', height: '24px', backgroundColor: form.color }"
                />
                {{ form.color }}
              </v-btn>
            </template>

            <v-color-picker
              v-model="form.color"
              mode="hex"
              :modes="['hex']"
              show-swatches
              hide-inputs
            />
          </v-menu>
        </div>
        <v-btn
          v-else
          variant="tonal"
          size="small"
          prepend-icon="mdi-palette"
          @click="form.color = randomColor()"
        >
          Adicionar cor
        </v-btn>
      </div>

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
import type { CategoryResponse, CreateCategoryRequest, PatchCategoryRequest } from '~/types/category'
import AppDialog from '~/components/common/AppDialog.vue'

const api = useApi();

const props = defineProps<{
  modelValue: boolean,
  category: CategoryResponse | null,
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean],
  saved: [],
}>();

const dialog = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v),
});

const isEditing = computed(() => props.category !== null);

// ─── Form State ──────────────────────────────────────
const formRef = ref();
const isValid = ref<boolean>(false);
const saving = ref<boolean>(false);
const error = ref<string | null>(null);

type FormData = {
  name: string,
  color: string | null,
}

const form = ref<FormData>(emptyForm());

function randomColor(): string {
  const colors = [
    '#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336',
    '#00BCD4', '#E91E63', '#3F51B5', '#009688', '#FF5722',
    '#607D8B', '#795548', '#CDDC39', '#FFC107', '#673AB7',
  ];
  return colors[Math.floor(Math.random() * colors.length)]!;
}

function emptyForm(): FormData {
  return {
    name: '',
    color: randomColor(),
  }
}

function toFormData(category: CategoryResponse): FormData {
  return {
    name: category.name,
    color: category.color,
  }
}

// Reset form when dialog opens
watch(dialog, (open) => {
  if (open) {
    error.value = null
    form.value = props.category ? toFormData(props.category) : emptyForm()
  }
});

// ─── Validation Rules ────────────────────────────────
const { rules } = useFormRules();

// ─── Actions ─────────────────────────────────────────
async function save() {
  error.value = null;
  saving.value = true;

  try {
    if (isEditing.value) {
      const payload: PatchCategoryRequest = {
        name: form.value.name.trim(),
        color: form.value.color ?? null,
      };
      await api.patch(`/categories/${props.category!.id}`, payload);
    } else {
      const payload: CreateCategoryRequest = {
        name: form.value.name.trim(),
        color: form.value.color ?? null,
      };
      await api.post('/categories', payload);
    }

    emit('saved');
  } catch (e: any) {
    const msg = e?.response?.data?.message;
    if (Array.isArray(msg) && msg.length > 0) {
      error.value = String(msg[0]);
    } else {
      error.value = 'Erro ao salvar categoria. Tente novamente.';
    }
  } finally {
    saving.value = false;
  }
}
</script>
