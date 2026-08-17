import { Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import type { AlertAudit, AlertOutcome } from '#/lib/api-client'
import {
  formatAlertOutcome,
  formatPlatform,
  formatSourceApp,
} from '#/lib/alert-audit'

function outcomeClass(outcome: AlertOutcome): string {
  if (outcome === 'executed') return 'bg-[var(--ja-green)]'
  if (outcome === 'skipped') return 'bg-[var(--ja-yellow-muted)]'
  return 'bg-[var(--ja-gray-100)]'
}

type AlertAuditTableProps = {
  alerts: AlertAudit[]
  totalCount?: number
  loadFailed?: boolean
}

export default function AlertAuditTable({
  alerts,
  totalCount = alerts.length,
  loadFailed = false,
}: AlertAuditTableProps) {
  const [sortAsc, setSortAsc] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)

  const sorted = useMemo(() => {
    const copy = [...alerts]
    copy.sort((a, b) => {
      if (a.created_at < b.created_at) return sortAsc ? -1 : 1
      if (a.created_at > b.created_at) return sortAsc ? 1 : -1
      return 0
    })
    return copy
  }, [alerts, sortAsc])

  if (!alerts.length) {
    if (loadFailed) return null
    if (totalCount > 0) {
      return <p className="text-sm text-[var(--sea-ink-soft)]">No alerts match this filter.</p>
    }
    return (
      <p className="text-sm text-[var(--sea-ink-soft)]">
        No captured alerts yet. When the desktop watcher is running, banners show up here.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border-2 border-[var(--ja-black)]">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-[var(--chip-bg)] text-[var(--sea-ink-soft)]">
          <tr>
            <th className="px-3 py-2 font-semibold">
              <button type="button" className="cursor-pointer bg-transparent" onClick={() => setSortAsc((v) => !v)}>
                Time{sortAsc ? ' ↑' : ' ↓'}
              </button>
            </th>
            <th className="px-3 py-2 font-semibold">App</th>
            <th className="px-3 py-2 font-semibold">Title</th>
            <th className="px-3 py-2 font-semibold">Outcome</th>
            <th className="px-3 py-2 font-semibold">Reason</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((alert) => {
            const open = openId === alert.id
            return (
              <tr key={alert.id} className="border-t border-[var(--line)] align-top">
                <td className="whitespace-nowrap px-3 py-2">{new Date(alert.created_at).toLocaleString()}</td>
                <td className="px-3 py-2">
                  <div className="font-medium text-[var(--sea-ink)]">{formatSourceApp(alert.source_app)}</div>
                  <div className="text-xs text-[var(--sea-ink-soft)]">{formatPlatform(alert.platform)}</div>
                </td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    className="cursor-pointer bg-transparent text-left font-medium text-[var(--sea-ink)]"
                    onClick={() => setOpenId(open ? null : alert.id)}
                  >
                    {alert.title || 'Untitled alert'}
                  </button>
                  <p className={`mt-1 max-w-xl text-[var(--sea-ink-soft)] ${open ? '' : 'line-clamp-2'}`}>
                    {alert.text}
                  </p>
                </td>
                <td className="px-3 py-2">
                  <span
                    className={`inline-block border-2 border-[var(--ja-black)] px-2 py-0.5 text-xs font-bold ${outcomeClass(alert.outcome)}`}
                  >
                    {formatAlertOutcome(alert.outcome)}
                  </span>
                  {alert.trade_status ? (
                    <div className="mt-1 text-xs text-[var(--sea-ink-soft)]">{alert.trade_status}</div>
                  ) : null}
                  {alert.trade_id ? (
                    <Link
                      to="/dashboard"
                      search={{ trade: alert.trade_id }}
                      className="mt-1 inline-block text-xs font-semibold text-[var(--ja-black)] underline"
                    >
                      View trade
                    </Link>
                  ) : null}
                </td>
                <td className="px-3 py-2 text-[var(--sea-ink-soft)]">{alert.skip_reason ?? '—'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
