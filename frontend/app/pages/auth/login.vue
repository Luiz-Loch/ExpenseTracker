<template>
  <v-card class="pa-5 app-card">
    <v-card-title class="pa-0 pb-3">
      <span class="text-h6 font-weight-bold">Login</span>
    </v-card-title>

    <v-card-text class="pa-0">
      <v-form v-model="isValid" @submit.prevent="onSubmit">
        <v-text-field
          v-model.trim="email"
          label="Email"
          type="email"
          autocomplete="email"
          variant="outlined"
          density="comfortable"
          :rules="[rules.required, rules.email]"
          class="mb-3"
        />

        <v-text-field
          v-model="password"
          label="Senha"
          :type="showPassword ? 'text' : 'password'"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showPassword = !showPassword"
          autocomplete="current-password"
          variant="outlined"
          density="comfortable"
          :rules="[rules.required, rules.strongPassword]"
          class="mb-3"
        />

        <v-alert v-if="error" type="error" variant="tonal" class="mb-3">
          {{ error }}
        </v-alert>

        <v-btn color="primary" type="submit" block :loading="loading" :disabled="!isValid || loading">
          Entrar
        </v-btn>

        <div class="text-caption mt-3">
          Não tem conta?
          <NuxtLink to="/auth/register">Cadastre-se</NuxtLink>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: 'auth' });

const auth = useAuthStore();

const email = ref<string>('');
const password = ref<string>('');
const loading = ref<boolean>(false);
const error = ref<string | null>(null);
const isValid = ref<boolean>(false);
const showPassword = ref<boolean>(false);

const { rules } = useFormRules();

async function onSubmit(): Promise<void> {
  error.value = null;
  loading.value = true;
  try {
    await auth.login({ email: email.value, password: password.value });
    await navigateTo('/app');
  } catch (e: any) {
    const status = e?.response?.status

    switch (status) {
      case 401:
        error.value = 'Email ou senha inválidos.'
        break

      default:
        error.value = 'Não foi possível realizar o login. Tente novamente.'
    }
  } finally {
    loading.value = false;
  }
}
</script>
