export type PaginatedResponse<T> = {
  data: Array<T>
  total: number
  page: number
  limit: number
  totalPages: number
}
