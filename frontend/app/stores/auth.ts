import { defineStore, StoreDefinition } from 'pinia'
import type { LoginPayload, AuthResponse } from '../types/auth'

export const useAuthStore: StoreDefinition = defineStore('auth', {
  state: () => ({
    token: null as string | null,
  }),

  getters: {
    isAuthenticated: (s) => !!s.token,
  },

  actions: {
    async login(payload: LoginPayload): Promise<void> {
      const { $api } = useNuxtApp()

      const { data } = await $api.post<AuthResponse>('/auth/login', payload);

      // ajuste conforme seu backend retorna (ex: access_token)
      this.token = data.accessToken

      // (teste rápido / simples) persistir
      if (import.meta.client) localStorage.setItem('token', data.accessToken)
    },

    loadTokenFromStorage(): void {
      if (!import.meta.client) return
      const token = localStorage.getItem('token')
      this.token = token
    },

    logout(): void {
      this.token = null
      if (import.meta.client) localStorage.removeItem('token')
    },
  },
})
