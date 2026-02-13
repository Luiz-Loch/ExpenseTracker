import axios, { type AxiosInstance } from 'axios'
import type { RuntimeConfig } from 'nuxt/schema';
import { useAuthStore } from '../stores/auth'

export default defineNuxtPlugin((nuxtApp) => {
  const config: RuntimeConfig = useRuntimeConfig()

  // Create a new Axios instance with the base URL from runtime config
  const api: AxiosInstance = axios.create({
    baseURL: config.public.apiBaseUrl as string,
    timeout: 10_000,
    headers: { Accept: 'application/json' },
  });

  // 1) JWT global
  api.interceptors.request.use((req) => {
    const auth = useAuthStore(nuxtApp.$pinia)
    if (auth.token) {
      req.headers.Authorization = `Bearer ${auth.token}`
    }
    return req
  })

  // 2) 401 global
  api.interceptors.response.use(
    (res) => res,
    (error) => {
      const status = error?.response?.status

      if (status === 401) {
        const auth = useAuthStore(nuxtApp.$pinia)

        // evita loop se o próprio login/register der 401 (ou endpoint público)
        const url = String(error?.config?.url ?? '')
        const isAuthRoute = url.includes('/auth')

        if (!isAuthRoute) {
          auth.logout()
          // redireciona se fizer sentido:
          navigateTo('/auth/login')
        }
      }

      return Promise.reject(error)
    }
  )

  return {
    provide: {
      api,
    },
  }
})
