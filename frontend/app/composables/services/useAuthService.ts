import type { LoginPayload, RegisterPayload, AuthResponse } from '~/types/auth'

export function useAuthService() {
  const api = useApi()

  return {
    login: (payload: LoginPayload) =>
      api.post<AuthResponse>('/auth/login', payload),

    register: (payload: RegisterPayload) =>
      api.post<AuthResponse>('/auth/register', payload),
  }
}
