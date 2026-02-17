import type { CategoryResponse } from './category'

// ─── Enums ───────────────────────────────────────────
export enum Currency {
  BRL = 'BRL',
}

export enum ExpenseType {
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME',
}

export enum Period {
  ALL = 'all',
  LAST_7_DAYS = '7d',
  LAST_30_DAYS = '30d',
  THIS_MONTH = 'this-month',
  LAST_MONTH = 'last-month',
  LAST_3_MONTHS = '3m',
  THIS_YEAR = 'this-year',
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

// ─── Request DTOs ────────────────────────────────────
export type CreateExpenseRequest = {
  name: string
  type: ExpenseType
  amount: number
  spentAt: string
  categoryId?: string
  description?: string
  currency?: Currency
}

export type PatchExpenseRequest = {
  name?: string
  type?: ExpenseType
  amount?: number
  spentAt?: string
  categoryId?: string | null
  description?: string | null
  currency?: Currency
}
