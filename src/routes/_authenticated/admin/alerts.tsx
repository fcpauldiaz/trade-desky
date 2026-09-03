import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { api, type AdminAlertAudit } from '#/lib/api-client'

export const Route = createFileRoute('/_authenticated/admin/alerts')({
  component: AdminAlertsPage,
})

function AdminAlertsPage() {
  const [email, setEmail] = useState('')
  const [outcome, setOutcome] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [applied, setApplied] = useState({ email: '', outcome: '', from: '', to: '' })
  const [alerts, setAlerts] = useState<AdminAlertAudit[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    api
      .adminAlerts({
        email: applied.email || undefined,
        outcome: applied.outcome || undefined,
        from: applied.from || undefined,
        to: applied.to || undefined,
        limit: 200,
      })
      .then((rows) => {
        if (!cancelled) setAlerts(rows)
      })
      .catch(() => {
        if (!cancelled) setError('Could not load alerts')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [applied])

  return (
    <div className="admin-fade space-y-4">
      <div className="admin-filter-bar">
        <label className="admin-filter-field">
          Outcome
          <select
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
            className="demo-input"
          >
            <option value="">All</option>
            <option value="executed">executed</option>
            <option value="skipped">skipped</option>
            <option value="pending">pending</option>
          </select>
        </label>
        <label className="admin-filter-field">
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="demo-input"
            placeholder="user@…"
          />
        </label>
        <label className="admin-filter-field">
          From
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="demo-input"
          />
        </label>
        <label className="admin-filter-field">
          To
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="demo-input"
          />
        </label>
        <div className="flex items-end gap-2">
          <button
            type="button"
            className="btn-primary btn-sm"
            onClick={() => setApplied({ email, outcome, from, to })}
          >
            Apply
          </button>
          <button
            type="button"
            className="btn-secondary btn-sm"
            onClick={() => {
              setEmail('')
              setOutcome('')
              setFrom('')
              setTo('')
              setApplied({ email: '', outcome: '', from: '', to: '' })
            }}
          >
            Clear
          </button>
        </div>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {loading ? <p className="text-sm text-[var(--ja-gray-600)]">Loading…</p> : null}
      {!loading ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>User</th>
                <th>Outcome</th>
                <th>Skip reason</th>
                <th>Payload</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((row) => {
                const expanded = expandedId === row.id
                const preview =
                  typeof row.payload === 'string'
                    ? row.payload
                    : JSON.stringify(row.payload ?? row.text ?? '')
                return (
                  <tr
                    key={row.id}
                    className="admin-table-row"
                    onClick={() => setExpandedId(expanded ? null : row.id)}
                  >
                    <td className="whitespace-nowrap text-xs">
                      {new Date(row.created_at).toLocaleString()}
                    </td>
                    <td className="text-xs font-semibold">{row.user_email || '—'}</td>
                    <td className="text-xs">{row.outcome}</td>
                    <td className="max-w-[14rem] text-xs">{row.skip_reason || '—'}</td>
                    <td className="max-w-[18rem] font-mono text-[11px]">
                      {expanded ? preview : `${preview.slice(0, 80)}${preview.length > 80 ? '…' : ''}`}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {alerts.length === 0 ? (
            <p className="mt-3 text-sm text-[var(--ja-gray-600)]">No alerts</p>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
