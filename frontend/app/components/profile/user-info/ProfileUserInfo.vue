<template>
  <v-card variant="outlined" rounded="lg" class="mb-6 app-card">
    <v-card-title class="pa-5 pb-3">
      <span class="text-h6 font-weight-bold">Informações pessoais</span>
    </v-card-title>

    <v-card-text class="pa-5 pt-2">
      <v-form ref="formRef" v-model="isValid" @submit.prevent="save">
        <v-text-field
          v-model="form.name"
          label="Nome"
          variant="outlined"
          density="comfortable"
          :rules="[rules.required, rules.min(2), rules.max(100)]"
          class="mb-3"
        />

        <v-text-field
          :model-value="user.email"
          label="Email"
          variant="outlined"
          density="comfortable"
          disabled
          hint="O email não pode ser alterado"
          persistent-hint
          class="mb-3"
        />

        <v-text-field
          :model-value="formattedCreatedAt"
          label="Membro desde"
          variant="outlined"
          density="comfortable"
          disabled
          class="mb-3"
        />

        <v-alert v-if="error" type="error" variant="tonal" class="mb-3">
          {{ error }}
        </v-alert>

        <div class="d-flex justify-end">
          <v-btn
            color="primary"
            type="submit"
            :loading="saving"
            :disabled="!isValid || saving || !nameChanged"
          >
            Salvar nome
          </v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { VForm } from 'vuetify/components'
import type { UserResponse, PatchUserRequest } from '~/types/user'

const props = defineProps<{
  user: UserResponse,
}>();

const emit = defineEmits<{
  saved: [user: UserResponse],
}>();

const userService = useUserService();
const { rules } = useFormRules();

// ─── Form State ──────────────────────────────────────
const formRef = ref<InstanceType<typeof VForm> | null>(null)
const isValid = ref<boolean>(false);
const saving = ref<boolean>(false);
const error = ref<string | null>(null);

const form = ref({ name: props.user.name });

const nameChanged = computed<boolean>(() => form.value.name.trim() !== props.user.name)

watch(() => props.user, (u) => {
  form.value.name = u.name;
});

// ─── Computed ────────────────────────────────────────
const formattedCreatedAt = computed(() => {
  return new Date(props.user.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
});

// ─── Actions ─────────────────────────────────────────
async function save(): Promise<void> {
  error.value = null;

  const result = await formRef.value?.validate();
  if (!result?.valid) return
  if (!nameChanged.value) return

  saving.value = true;
  try {
    const payload: PatchUserRequest = { name: form.value.name };
    const res = await userService.updateMe(payload);
    emit('saved', res.data);
  } catch (e: any) {
    console.error('Erro ao atualizar nome:', e);
    error.value = e.response?.data?.message || 'Erro ao atualizar nome';
  } finally {
    saving.value = false;
  }
}
</script>
