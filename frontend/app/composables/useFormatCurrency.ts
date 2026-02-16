import { Currency } from "~/types/expense"

export function useFormatCurrency() {
  function formatCurrency(value: number, currency: Currency = Currency.BRL): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency,
    }).format(value)
  }

  return { formatCurrency }
}
