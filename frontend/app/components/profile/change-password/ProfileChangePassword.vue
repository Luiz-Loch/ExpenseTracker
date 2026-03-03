<template>
  <v-card variant="outlined" rounded="lg" class="mb-6 app-card">
    <v-card-title class="pa-5 pb-3">
      <span class="text-h6 font-weight-bold">Alterar senha</span>
    </v-card-title>

    <v-card-text class="pa-5 pt-2">
      <v-form ref="formRef" v-model="isValid" @submit.prevent="save">
        <v-text-field
          v-model="form.oldPassword"
          label="Senha atual"
          variant="outlined"
          density="comfortable"
          autocomplete="current-password"
          :type="showOldPassword ? 'text' : 'password'"
          :append-inner-icon="showOldPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showOldPassword = !showOldPassword"
          :rules="[rules.required]"
          class="mb-3"
        />

        <v-text-field
          v-model="form.newPassword"
          label="Nova senha"
          variant="outlined"
          density="comfortable"
          autocomplete="new-password"
          :type="showNewPassword ? 'text' : 'password'"
          :append-inner-icon="showNewPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showNewPassword = !showNewPassword"
          :rules="[rules.required, rules.strongPassword]"
          class="mb-3"
        />

        <v-text-field
          v-model="form.confirmPassword"
          label="Confirmar nova senha"
          variant="outlined"
          density="comfortable"
          autocomplete="new-password"
          :type="showConfirmPassword ? 'text' : 'password'"
          :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showConfirmPassword = !showConfirmPassword"
          :rules="[rules.required, rules.samePassword]"
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
            :disabled="!isValid || saving"
          >
            Alterar senha
          </v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ChangePasswordRequest } from '~/types/user'

const emit = defineEmits<{
  saved: [],
}>();

const userService = useUserService();

const newPasswordRef = computed(() => form.value.newPassword);
const { rules } = useFormRules({ password: newPasswordRef });

// ─── Form State ──────────────────────────────────────
const formRef = ref();
const isValid = ref<boolean>(false);
const saving = ref<boolean>(false);
const error = ref<string | null>(null);

const showOldPassword = ref<boolean>(false);
const showNewPassword = ref<boolean>(false);
const showConfirmPassword = ref<boolean>(false);

const form = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
});

// ─── Actions ─────────────────────────────────────────
async function save(): Promise<void> {
  error.value = null;
  saving.value = true;
  try {
    const payload: ChangePasswordRequest = {
      oldPassword: form.value.oldPassword,
      newPassword: form.value.newPassword,
    };
    await userService.changePassword(payload);
    form.value = { oldPassword: '', newPassword: '', confirmPassword: '' };
    formRef.value?.reset();
    emit('saved');
  } catch (e: any) {
    console.error('Erro ao alterar senha:', e);
    error.value = e.response?.data?.message || 'Erro ao alterar senha';
  } finally {
    saving.value = false;
  }
}
</script>
