import type { ExpenseResponse, CreateExpenseRequest, PatchExpenseRequest } from '~/types/expense'
import type { PaginatedResponse } from '~/types/pagination'

export function useExpenseService() {
  const api = useApi()

  return {
    list: (params: { page: number; limit: number }) =>
      api.get<PaginatedResponse<ExpenseResponse>>('/expenses', { params }),

    create: (data: CreateExpenseRequest) =>
      api.post<ExpenseResponse>('/expenses', data),

    update: (id: string, data: PatchExpenseRequest) =>
      api.patch<ExpenseResponse>(`/expenses/${id}`, data),

    remove: (id: string) =>
      api.delete(`/expenses/${id}`),
  }
}
