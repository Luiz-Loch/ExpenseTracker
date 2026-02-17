<template>
  <v-card class="pa-5 app-card">
    <v-card-title class="pa-0 pb-3">
      <span class="text-h6 font-weight-bold">Cadastro</span>
    </v-card-title>

    <v-card-text class="pa-0">
      <v-form v-model="isValid" @submit.prevent="onSubmit">
        <!-- NOME -->
        <v-text-field
          v-model.trim="name"
          label="Nome"
          autocomplete="name"
          variant="outlined"
          density="comfortable"
          :rules="[rules.required, rules.min(2), rules.max(100)]"
          class="mb-3"
        />

        <!-- EMAIL -->
        <v-text-field
          v-model.trim="email"
          label="Email"
          type="email"
          autocomplete="email"
          variant="outlined"
          density="comfortable"
          :rules="[rules.required, rules.email, rules.max(100)]"
          class="mb-3"
        />

        <!-- SENHA -->
        <v-text-field
          v-model="password"
          label="Senha"
          :type="showPassword ? 'text' : 'password'"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showPassword = !showPassword"
          autocomplete="new-password"
          variant="outlined"
          density="comfortable"
          :rules="[rules.required, rules.strongPassword]"
          class="mb-3"
        />

        <!-- CONFIRMAR SENHA -->
        <v-text-field
          v-model="confirmPassword"
          label="Confirmar senha"
          :type="showConfirmPassword ? 'text' : 'password'"
          :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showConfirmPassword = !showConfirmPassword"
          autocomplete="new-password"
          variant="outlined"
          density="comfortable"
          :rules="[rules.required, rules.samePassword]"
          class="mb-3"
        />

        <v-alert v-if="error" type="error" variant="tonal" class="mb-3">
          {{ error }}
        </v-alert>

        <v-btn
          color="primary"
          type="submit"
          block
          :loading="loading"
          :disabled="!isValid || loading"
        >
          Criar conta
        </v-btn>

        <div class="text-caption mt-3">
          Já tem conta?
          <NuxtLink to="/auth/login">Entrar</NuxtLink>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: 'auth' })

const auth = useAuthStore()

const name = ref<string>('')
const email = ref<string>('')
const password = ref<string>('')
const confirmPassword = ref<string>('')

const loading = ref<boolean>(false)
const error = ref<string | null>(null)
const isValid = ref<boolean>(false)
const showPassword = ref<boolean>(false)
const showConfirmPassword = ref<boolean>(false)

const { rules } = useFormRules({ password });

async function onSubmit(): Promise<void> {
  error.value = null
  loading.value = true

  try {
    await auth.register({
      name: name.value,
      email: email.value,
      password: password.value
    })

    await navigateTo('/app')
  } catch (e: any) {
    const status = e?.response?.status
    const msg = e?.response?.data?.message

    switch (status) {
      case 409:
        error.value = 'Este email já está em uso.'
        break

      case 400:
        if (Array.isArray(msg) && msg.length > 0) {
          error.value = String(msg[0])
        } else {
          error.value = 'Dados inválidos. Verifique e tente novamente.'
        }
        break

      default:
        error.value = 'Não foi possível realizar o cadastro.'
    }
  } finally {
    loading.value = false
  }
}
</script>
