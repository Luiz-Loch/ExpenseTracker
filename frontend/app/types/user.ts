export type UserResponse = {
  id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
}

export type PatchUserRequest = {
  name?: string
}

export type ChangePasswordRequest = {
  oldPassword: string
  newPassword: string
}
