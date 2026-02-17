<template>
  <v-card class="pa-4">
    <v-card-title>Cadastro</v-card-title>

    <v-card-text>
      <v-form v-model="isValid" @submit.prevent="onSubmit">
        <!-- NOME -->
        <v-text-field
          v-model.trim="name"
          label="Nome"
          autocomplete="name"
          :rules="[rules.required, rules.min(2), rules.max(100)]"
          class="mb-2"
        />

        <!-- EMAIL -->
        <v-text-field
          v-model.trim="email"
          label="Email"
          type="email"
          autocomplete="email"
          :rules="[rules.required, rules.email, rules.max(100)]"
          class="mb-2"
        />

        <!-- SENHA -->
        <v-text-field
          v-model="password"
          label="Senha"
          type="password"
          autocomplete="new-password"
          :rules="[rules.required, rules.strongPassword]"
          class="mb-2"
        />

        <!-- CONFIRMAR SENHA -->
        <v-text-field
          v-model="confirmPassword"
          label="Confirmar senha"
          type="password"
          autocomplete="new-password"
          :rules="[rules.required, rules.samePassword]"
          class="mb-2"
        />

        <v-alert v-if="error" type="error" variant="tonal" class="mb-3">
          {{ error }}
        </v-alert>

        <v-btn
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
definePageMeta({ layout: 'auth' })

import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()

const name = ref<string>('')
const email = ref<string>('')
const password = ref<string>('')
const confirmPassword = ref<string>('')

const loading = ref<boolean>(false)
const error = ref<string | null>(null)
const isValid = ref<boolean>(false)

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
