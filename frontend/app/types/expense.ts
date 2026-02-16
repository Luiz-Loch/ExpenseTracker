// ─── Enums ───────────────────────────────────────────
export enum Currency {
  BRL = 'BRL',
}

export enum ExpenseType {
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME',
}

// ─── Response DTOs ───────────────────────────────────
export type ExpenseResponse = {
  id: string
  userId: string
  category: CategoryResponse | null
  name: string
  description: string | null
  amount: number
  currency: Currency
  type: ExpenseType
  spentAt: Date
  createdAt: Date
  updatedAt: Date
}

export type CategoryResponse = {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}