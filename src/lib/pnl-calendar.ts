export type RealizedPnlStats = {
  filled: number
  wins: number
  losses: number
  winRate: number
}

export function currentMonthKey(now = new Date()): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export function parseMonth(month: string): { year: number; month: number } {
  const [year, monthIndex] = month.split('-').map(Number)
  return { year, month: monthIndex }
}

export function monthIsoBounds(month: string): { from: string; to: string } {
  const { year, month: monthIndex } = parseMonth(month)
  const from = new Date(Date.UTC(year, monthIndex - 1, 1))
  const to =
    monthIndex === 12 ? new Date(Date.UTC(year + 1, 0, 1)) : new Date(Date.UTC(year, monthIndex, 1))
  return { from: from.toISOString(), to: to.toISOString() }
}

export function shiftMonth(month: string, delta: number): string {
  const { year, month: monthIndex } = parseMonth(month)
  const shifted = new Date(year, monthIndex - 1 + delta, 1)
  return currentMonthKey(shifted)
}

export function formatMonthLabel(month: string): string {
  const { year, month: monthIndex } = parseMonth(month)
  return new Date(year, monthIndex - 1, 1).toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  })
}

export function formatDayLabel(day: string): string {
  const [year, monthIndex, date] = day.split('-').map(Number)
  return new Date(year, monthIndex - 1, date).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function monthGrid(month: string): Array<number | null> {
  const { year, month: monthIndex } = parseMonth(month)
  const firstDay = new Date(year, monthIndex - 1, 1)
  const daysInMonth = new Date(year, monthIndex, 0).getDate()
  const startWeekday = firstDay.getDay()
  return [
    ...Array.from({ length: startWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
}

export function dayKeyFor(month: string, day: number): string {
  const { year, month: monthIndex } = parseMonth(month)
  return `${year}-${String(monthIndex).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function tradeUtcDayKey(createdAt: string): string {
  const date = new Date(createdAt)
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`
}

export function tradeInMonth(trade: { created_at: string }, month: string): boolean {
  return tradeUtcDayKey(trade.created_at).slice(0, 7) === month
}

export function heatmapMaxAbs(dailyPnl: Record<string, number>): number {
  const values = Object.values(dailyPnl)
  if (values.length === 0) return 1
  return Math.max(1, ...values.map(Math.abs))
}

export function pnlHeatColor(pnl: number | undefined, maxAbs: number): string {
  if (pnl === undefined) return '#f9fafb'
  const intensity = Math.min(1, Math.abs(pnl) / maxAbs)
  if (pnl >= 0) return `rgba(34, 120, 80, ${0.15 + intensity * 0.55})`
  return `rgba(180, 60, 60, ${0.15 + intensity * 0.55})`
}

export function sumDailyPnl(dailyPnl: Record<string, number>): number {
  return Object.values(dailyPnl).reduce((sum, value) => sum + value, 0)
}

export function realizedPnlStats(trades: Array<{ pnl: number | null }>): RealizedPnlStats {
  const realized = trades.filter((trade) => trade.pnl != null)
  const wins = realized.filter((trade) => (trade.pnl ?? 0) > 0).length
  const losses = realized.filter((trade) => (trade.pnl ?? 0) < 0).length
  return {
    filled: realized.length,
    wins,
    losses,
    winRate: realized.length ? (wins / realized.length) * 100 : 0,
  }
}
