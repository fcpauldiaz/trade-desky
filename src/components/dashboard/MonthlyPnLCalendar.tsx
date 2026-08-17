import { useEffect, useRef, useState } from 'react'
import type { Trade } from '#/lib/api-client'
import PnlShareCard from '#/components/dashboard/PnlShareCard'
import {
  currentMonthKey,
  dayKeyFor,
  formatMonthLabel,
  heatmapMaxAbs,
  monthGrid,
  pnlHeatColor,
  realizedPnlStats,
  sumDailyPnl,
  tradeUtcDayKey,
} from '#/lib/pnl-calendar'
import { capturePng, pnlCaption, pnlShareFilename, shareOrDownload } from '#/lib/share-pnl'

type Props = {
  dailyPnl: Record<string, number>
  dailyLoading?: boolean
  monthTradesLoading?: boolean
  month: string
  monthTrades?: Trade[]
  onPrevMonth: () => void
  onNextMonth: () => void
}

export default function MonthlyPnLCalendar({
  dailyPnl,
  dailyLoading = false,
  monthTradesLoading = false,
  month,
  monthTrades = [],
  onPrevMonth,
  onNextMonth,
}: Props) {
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [sharing, setSharing] = useState<'month' | 'day' | null>(null)
  const [shareError, setShareError] = useState('')
  const monthCardRef = useRef<HTMLDivElement>(null)
  const dayCardRef = useRef<HTMLDivElement>(null)
  const cells = monthGrid(month)
  const maxAbs = heatmapMaxAbs(dailyPnl)
  const canGoNext = month < currentMonthKey()
  const monthStats = realizedPnlStats(monthTrades)
  const monthPnl = sumDailyPnl(dailyPnl)
  const dayTrades = selectedDay
    ? monthTrades.filter((trade) => tradeUtcDayKey(trade.created_at) === selectedDay)
    : []
  const dayStats = realizedPnlStats(dayTrades)
  const dayPnl = selectedDay ? (dailyPnl[selectedDay] ?? 0) : 0
  const shareDisabled = dailyLoading || monthTradesLoading || sharing !== null

  useEffect(() => {
    setSelectedDay(null)
    setShareError('')
  }, [month])

  async function share(kind: 'month' | 'day') {
    const node = kind === 'month' ? monthCardRef.current : dayCardRef.current
    if (!node) return
    const key = kind === 'month' ? month : selectedDay
    if (!key) return
    const pnl = kind === 'month' ? monthPnl : dayPnl
    setSharing(kind)
    setShareError('')
    try {
      const blob = await capturePng(node)
      await shareOrDownload({
        blob,
        filename: pnlShareFilename(kind, key),
        caption: pnlCaption(kind, key, pnl),
      })
    } catch {
      setShareError('Could not create share image')
    } finally {
      setSharing(null)
    }
  }

  return (
    <div className="island-shell rounded-2xl p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button type="button" className="btn-secondary px-3 py-1 text-sm" onClick={onPrevMonth}>
            Prev
          </button>
          <h2 className="text-lg font-semibold text-[var(--sea-ink)]">{formatMonthLabel(month)} P&amp;L</h2>
          <button
            type="button"
            className="btn-secondary px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            onClick={onNextMonth}
            disabled={!canGoNext}
          >
            Next
          </button>
        </div>
        <button
          type="button"
          className="btn-primary px-4 py-2 text-sm"
          onClick={() => void share('month')}
          disabled={shareDisabled}
        >
          {sharing === 'month' ? 'Sharing…' : 'Share month'}
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-[var(--sea-ink-soft)]">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((label) => (
          <div key={label}>{label}</div>
        ))}
        {cells.map((day, idx) =>
          day ? (
            <button
              key={idx}
              type="button"
              className="rounded-lg border border-[var(--line)] p-2 text-sm transition hover:ring-2 hover:ring-[var(--ja-yellow)]"
              style={{ backgroundColor: pnlHeatColor(dailyPnl[dayKeyFor(month, day)], maxAbs) }}
              onClick={() => setSelectedDay(dayKeyFor(month, day))}
            >
              <div className="font-semibold text-[var(--sea-ink)]">{day}</div>
              <div className="text-[10px] text-[var(--sea-ink-soft)]">
                {dailyPnl[dayKeyFor(month, day)]?.toFixed(0) ?? '—'}
              </div>
            </button>
          ) : (
            <div key={idx} />
          ),
        )}
      </div>
      {selectedDay && (
        <div className="mt-4 rounded-xl border border-[var(--line)] bg-[var(--chip-bg)] p-4">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-[var(--sea-ink)]">{selectedDay}</h3>
            <button
              type="button"
              className="btn-secondary px-4 py-2 text-sm"
              onClick={() => void share('day')}
              disabled={shareDisabled}
            >
              {sharing === 'day' ? 'Sharing…' : 'Share day'}
            </button>
          </div>
          <p className="mb-2 text-sm text-[var(--sea-ink-soft)]">
            Day P&amp;L: {dailyPnl[selectedDay]?.toFixed(2) ?? '0.00'}
          </p>
          {dayTrades.length ? (
            <ul className="space-y-1 text-xs text-[var(--sea-ink-soft)]">
              {dayTrades.map((trade) => (
                <li key={trade.id}>
                  {trade.underlying} {trade.strike}
                  {trade.option_type[0].toUpperCase()} — {trade.status}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[var(--sea-ink-soft)]">No trades recorded.</p>
          )}
        </div>
      )}
      {shareError && <p className="mt-3 text-sm text-red-600">{shareError}</p>}
      <div
        aria-hidden
        style={{ position: 'fixed', left: -10000, top: 0, pointerEvents: 'none' }}
      >
        <div ref={monthCardRef}>
          <PnlShareCard
            variant="month"
            month={month}
            dailyPnl={dailyPnl}
            monthPnl={monthPnl}
            winRate={monthStats.winRate}
            filledTrades={monthStats.filled}
          />
        </div>
        {selectedDay && (
          <div ref={dayCardRef}>
            <PnlShareCard
              variant="day"
              day={selectedDay}
              dayPnl={dayPnl}
              tradeCount={dayTrades.length}
              wins={dayStats.wins}
              losses={dayStats.losses}
            />
          </div>
        )}
      </div>
    </div>
  )
}
