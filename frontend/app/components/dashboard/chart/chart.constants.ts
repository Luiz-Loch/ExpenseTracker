import type { ChartOptions } from 'chart.js'

// ─── Default colors to charts ──────────────────────
export const CHART_COLORS = {
  primary: '#1e293b',
  primaryFill: 'rgba(30, 41, 59, 0.05)',
  tick: '#64748b',
  gridLine: 'rgba(0,0,0,0.06)',
} as const

// ─── Helpers ─────────────────────────────────────────
export function formatYAxisTick(value: number): string | number {
  if (value >= 1000) return `${Math.round(value / 1000)}k`
  return value
}

// ─── Reusable scales configuration ───────────────────
export function createDefaultScales(): ChartOptions<'bar' | 'line'>['scales'] {
  return {
    x: {
      grid: { display: false },
      ticks: { color: CHART_COLORS.tick, font: { size: 12 } },
    },
    y: {
      grid: { color: CHART_COLORS.gridLine },
      ticks: {
        color: CHART_COLORS.tick,
        font: { size: 12 },
        callback: (v) => formatYAxisTick(Number(v)),
      },
    },
  }
}
