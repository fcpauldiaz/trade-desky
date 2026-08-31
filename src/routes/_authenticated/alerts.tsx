import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import AlertAuditTable from '#/components/dashboard/AlertAuditTable'
import UpgradeBanner from '#/components/UpgradeBanner'
import { api, type AlertAudit } from '#/lib/api-client'
import {
  alertCounts,
  currentDateKey,
  filterAlerts,
  filterAlertsByDateRange,
  type AlertFilter,
} from '#/lib/alert-audit'

export const Route = createFileRoute('/_authenticated/alerts')({ component: AlertsPage })

const FILTERS: Array<{ id: AlertFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'executed', label: 'Executed' },
  { id: 'skipped', label: 'Skipped' },
  { id: 'pending', label: 'Pending' },
]

function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertAudit[]>([])
  const [filter, setFilter] = useState<AlertFilter>('all')
  const [fromDate, setFromDate] = useState(() => currentDateKey())
  const [toDate, setToDate] = useState(() => currentDateKey())
  const [canTrade, setCanTrade] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .billing()
      .then((billing) => setCanTrade(billing.can_process_trades))
      .catch(() => setCanTrade(false))
    api
      .alerts(200)
      .then(setAlerts)
      .catch(() => setError('Could not load captured alerts'))
      .finally(() => setLoading(false))
  }, [])

  const dateFiltered = useMemo(
    () => filterAlertsByDateRange(alerts, fromDate, toDate),
    [alerts, fromDate, toDate],
  )
  const counts = useMemo(() => alertCounts(dateFiltered), [dateFiltered])
  const visible = useMemo(() => filterAlerts(dateFiltered, filter), [dateFiltered, filter])

  return (
    <main className="page-wrap space-y-6 px-4 py-10">
      <div>
        <h1 className="text-3xl font-black text-[var(--ja-black)]">Alert audit</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ja-gray-600)]">
          Every banner the desktop watcher sent in. See whether Trade Desky executed a trade, skipped it, or is still
          waiting.
        </p>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {!canTrade ? <UpgradeBanner /> : null}
      <div className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--ja-black)]">
          From
          <input
            type="date"
            className="demo-input w-auto"
            value={fromDate}
            max={toDate || undefined}
            onChange={(event) => setFromDate(event.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--ja-black)]">
          To
          <input
            type="date"
            className="demo-input w-auto"
            value={toDate}
            min={fromDate || undefined}
            onChange={(event) => setToDate(event.target.value)}
          />
        </label>
        <button
          type="button"
          className="btn-secondary btn-sm"
          onClick={() => {
            const today = currentDateKey()
            setFromDate(today)
            setToDate(today)
          }}
        >
          Today
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map(({ id, label }) => {
          const active = filter === id
          return (
            <button
              key={id}
              type="button"
              className={active ? 'btn-primary btn-sm' : 'btn-secondary btn-sm'}
              onClick={() => setFilter(id)}
            >
              {label} ({counts[id]})
            </button>
          )
        })}
      </div>
      <section className="island-shell rounded-2xl p-5">
        {loading ? (
          <p className="text-sm text-[var(--sea-ink-soft)]">Loading alerts…</p>
        ) : (
          <AlertAuditTable alerts={visible} totalCount={dateFiltered.length} loadFailed={!!error} />
        )}
      </section>
    </main>
  )
}
