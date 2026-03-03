import type { SummaryReportResponse, MonthlyReportResponse } from '~/types/report'

export function useReportService() {
  const api = useApi()

  return {
    summary: (params: { from: string; to: string }) =>
      api.get<SummaryReportResponse>('/reports/summary', { params }),

    monthly: (year: number) =>
      api.get<MonthlyReportResponse>('/reports/monthly', { params: { year } }),
  }
}
