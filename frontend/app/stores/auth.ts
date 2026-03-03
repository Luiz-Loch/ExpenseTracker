import { defineStore } from 'pinia'
import type { LoginPayload, RegisterPayload } from '../types/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
  }),

  getters: {
    isAuthenticated: (s) => !!s.token,
  },

  actions: {
    async login(payload: LoginPayload): Promise<void> {
      const authService = useAuthService()

      const { data } = await authService.login(payload);

      this.token = data.accessToken

      if (import.meta.client) {
        localStorage.setItem('token', data.accessToken);
      }
    },

    async register(payload: RegisterPayload): Promise<void> {
      const authService = useAuthService()

      const { data } = await authService.register(payload);

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
