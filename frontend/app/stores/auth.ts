import { defineStore } from 'pinia'
import type { LoginPayload, AuthResponse, RegisterPayload } from '../types/auth'

export const useAuthStore = defineStore('auth', {
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

      this.token = data.accessToken

      if (import.meta.client) {
        localStorage.setItem('token', data.accessToken);
      }
    },

    async register(payload: RegisterPayload): Promise<void> {
      const { $api } = useNuxtApp()

      const { data } = await $api.post<AuthResponse>('/auth/register', payload);

      this.token = data.accessToken

      if (import.meta.client) {
        localStorage.setItem('token', data.accessToken);
      }
    },

    loadTokenFromStorage(): void {
      if (!import.meta.client) {
        return;
      }
      const token = localStorage.getItem('token')
      this.token = token
    },

    logout(): void {
      this.token = null
      if (import.meta.client) {
        localStorage.removeItem('token');
      }
    },
  },
})
