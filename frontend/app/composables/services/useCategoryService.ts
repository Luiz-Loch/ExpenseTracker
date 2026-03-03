import type { CategoryResponse, CreateCategoryRequest, PatchCategoryRequest } from '~/types/category'
import type { PaginatedResponse } from '~/types/pagination'

export function useCategoryService() {
  const api = useApi()

  return {
    list: (params: { page: number; limit: number }) =>
      api.get<PaginatedResponse<CategoryResponse>>('/categories', { params }),

    create: (data: CreateCategoryRequest) =>
      api.post<CategoryResponse>('/categories', data),

    update: (id: string, data: PatchCategoryRequest) =>
      api.patch<CategoryResponse>(`/categories/${id}`, data),

    remove: (id: string) =>
      api.delete(`/categories/${id}`),
  }
}
