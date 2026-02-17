// ─── Response DTOs ───────────────────────────────────
export const CATEGORY_DEFAULT_COLOR = '#9e9e9e'

export type CategoryResponse = {
  id: string
  name: string
  color: string | null
  createdAt: Date
  updatedAt: Date
}

// ─── Request DTOs ────────────────────────────────────
export type CreateCategoryRequest = {
  name: string
  color?: string | null
}

export type PatchCategoryRequest = {
  name?: string
  color?: string | null
}
