import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { api } from '#/lib/api-client'
import KpiStrip from '#/components/dashboard/KpiStrip'
import MonthlyPnLCalendar from '#/components/dashboard/MonthlyPnLCalendar'
import TradeTable from '#/components/dashboard/TradeTable'
import UpgradeBanner from '#/components/UpgradeBanner'

export const Route = createFileRoute('/_authenticated/dashboard')({ component: DashboardPage })

function DashboardPage() {
  const [mode, setMode] = useState('')
  const [billing, setBilling] = useState<{ can_process_trades: boolean } | null>(null)
  const [summary, setSummary] = useState({ total_trades: 0, total_pnl: 0, mtd_pnl: 0, win_rate: 0 })
  const [daily, setDaily] = useState<Record<string, number>>({})
  const [trades, setTrades] = useState<Awaited<ReturnType<typeof api.trades>>>([])
  const [error, setError] = useState('')
  const month = useMemo(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  }, [])

  useEffect(() => {
    api.billing()
      .then(setBilling)
      .catch(() => {
        setBilling({ can_process_trades: false })
        setError('Could not load billing status')
      })
    api.summary().then(setSummary).catch(() => setError('Could not load performance summary'))
    api
      .dailyPnl(month)
      .then(setDaily)
      .catch(() => setError('Could not load daily P&L'))
    api.trades(mode || undefined).then(setTrades).catch(() => setError('Could not load trades'))
  }, [mode, month])

  return (
    <main className="page-wrap space-y-6 px-4 py-10">
      <h1 className="text-3xl font-bold text-[var(--sea-ink)]">Dashboard</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {billing && !billing.can_process_trades && <UpgradeBanner />}
      <KpiStrip
        mtdPnl={summary.mtd_pnl}
        totalPnl={summary.total_pnl}
        winRate={summary.win_rate}
        totalTrades={summary.total_trades}
        mode={mode}
        onModeChange={setMode}
      />
      <MonthlyPnLCalendar dailyPnl={daily} month={month} trades={trades} />
      <section>
        <h2 className="mb-3 text-lg font-semibold">Recent trades</h2>
        <TradeTable trades={trades} />
      </section>
    </main>
  )
}
