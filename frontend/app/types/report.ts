import type { CategoryResponse } from "./category"
import type { Currency } from "./expense"

export type TotalsResponse = {
  income: number
  expense: number
  balance: number
  count: number
}

export type MonthlyItemResponse = {
  month: number
  totals: TotalsResponse
}

export type MonthlyReportResponse = {
  year: number
  currency: Currency
  months: Array<MonthlyItemResponse>
}

export type CategoryItemResponse = {
  category: CategoryResponse | null
  totals: TotalsResponse
}

export type ByCategoryReportResponse = {
  range: {
    from: Date
    to: Date
  }
  currency: Currency
  byCategory: Array<CategoryItemResponse>
}

export type SummaryReportResponse = {
  range: {
    from: Date
    to: Date
  }
  currency: Currency
  totals: TotalsResponse
  byCategory: Array<CategoryItemResponse>
}