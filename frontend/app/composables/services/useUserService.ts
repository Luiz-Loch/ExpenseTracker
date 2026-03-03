import type { UserResponse, PatchUserRequest, ChangePasswordRequest } from '~/types/user'

export function useUserService() {
  const api = useApi()

  return {
    getMe: () =>
      api.get<UserResponse>('/users/me'),

    updateMe: (data: PatchUserRequest) =>
      api.patch<UserResponse>('/users/me', data),

    changePassword: (data: ChangePasswordRequest) =>
      api.patch('/users/me/password', data),

    deleteMe: () =>
      api.delete('/users/me'),
  }
}
