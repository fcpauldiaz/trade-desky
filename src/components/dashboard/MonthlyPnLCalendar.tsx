import { useState } from 'react'
import type { Trade } from '#/lib/api-client'

type Props = {
  dailyPnl: Record<string, number>
  month: string
  trades?: Trade[]
}

export default function MonthlyPnLCalendar({ dailyPnl, month, trades = [] }: Props) {
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [year, mon] = month.split('-').map(Number)
  const firstDay = new Date(year, mon - 1, 1)
  const daysInMonth = new Date(year, mon, 0).getDate()
  const startWeekday = firstDay.getDay()
  const cells: Array<number | null> = [
    ...Array.from({ length: startWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const maxAbs = Math.max(1, ...Object.values(dailyPnl).map(Math.abs))

  function dayKey(day: number): string {
    return `${year}-${String(mon).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  function cellColor(day: number): string {
    const pnl = dailyPnl[dayKey(day)]
    if (pnl === undefined) return 'var(--chip-bg)'
    const intensity = Math.min(1, Math.abs(pnl) / maxAbs)
    if (pnl >= 0) return `rgba(34, 120, 80, ${0.15 + intensity * 0.55})`
    return `rgba(180, 60, 60, ${0.15 + intensity * 0.55})`
  }

  const dayTrades = selectedDay
    ? trades.filter((t) => {
        const day = t.created_at.slice(0, 10)
        return day === selectedDay
      })
    : []

  return (
    <div className="island-shell rounded-2xl p-5">
      <h2 className="mb-4 text-lg font-semibold text-[var(--sea-ink)]">{month} P&amp;L</h2>
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-[var(--sea-ink-soft)]">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d}>{d}</div>
        ))}
        {cells.map((day, idx) =>
          day ? (
            <button
              key={idx}
              type="button"
              className="rounded-lg border border-[var(--line)] p-2 text-sm transition hover:ring-2 hover:ring-[var(--lagoon-deep)]"
              style={{ backgroundColor: cellColor(day) }}
              onClick={() => setSelectedDay(dayKey(day))}
            >
              <div className="font-semibold text-[var(--sea-ink)]">{day}</div>
              <div className="text-[10px] text-[var(--sea-ink-soft)]">
                {dailyPnl[dayKey(day)]?.toFixed(0) ?? '—'}
              </div>
            </button>
          ) : (
            <div key={idx} />
          ),
        )}
      </div>
      {selectedDay && (
        <div className="mt-4 rounded-xl border border-[var(--line)] bg-[var(--chip-bg)] p-4">
          <h3 className="mb-2 text-sm font-semibold text-[var(--sea-ink)]">{selectedDay}</h3>
          <p className="mb-2 text-sm text-[var(--sea-ink-soft)]">
            Day P&amp;L: {dailyPnl[selectedDay]?.toFixed(2) ?? '0.00'}
          </p>
          {dayTrades.length ? (
            <ul className="space-y-1 text-xs text-[var(--sea-ink-soft)]">
              {dayTrades.map((t) => (
                <li key={t.id}>
                  {t.underlying} {t.strike}
                  {t.option_type[0].toUpperCase()} — {t.status}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[var(--sea-ink-soft)]">No trades recorded.</p>
          )}
        </div>
      )}
    </div>
  )
}
