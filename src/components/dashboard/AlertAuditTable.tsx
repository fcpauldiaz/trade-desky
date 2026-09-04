import { Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import JsonPayloadViewer from '#/components/dashboard/JsonPayloadViewer'
import type { AlertAudit, AlertOutcome } from '#/lib/api-client'
import {
  formatAlertOutcome,
  formatAlertSourceLabel,
  formatIngestSource,
  formatPlatform,
  formatWebhookLabel,
  resolveIngestSource,
} from '#/lib/alert-audit'

function outcomeClass(outcome: AlertOutcome): string {
  if (outcome === 'executed') return 'bg-[var(--ja-green)]'
  if (outcome === 'skipped') return 'bg-[var(--ja-yellow-muted)]'
  return 'bg-[var(--ja-gray-100)]'
}

function sourceBadgeClass(alert: AlertAudit): string {
  return resolveIngestSource(alert) === 'webhook'
    ? 'bg-[var(--ja-pink)]'
    : 'bg-[var(--ja-gray-100)]'
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
      return <p className="text-sm text-[var(--sea-ink-soft)]">No alerts match the current filters.</p>
    }
    return (
      <p className="text-sm text-[var(--sea-ink-soft)]">
        No captured alerts yet. When the desktop watcher or an inbound webhook sends data, events show up here.
      </p>
    )
  }

  return (
    <>
      <div className="data-table-mobile-toolbar md:hidden">
        <button
          type="button"
          className="btn-secondary btn-sm"
          onClick={() => setSortAsc((value) => !value)}
        >
          Time{sortAsc ? ' ↑' : ' ↓'}
        </button>
      </div>

      <div className="data-table-card-list md:hidden" aria-label="Alert audit">
        {sorted.map((alert) => {
          const open = openId === alert.id
          const ingestSource = resolveIngestSource(alert)
          const title =
            alert.title || (ingestSource === 'webhook' ? formatWebhookLabel(alert) : 'Untitled alert')

          return (
            <article key={alert.id} className="data-table-card">
              <div className="data-table-card-head">
                <button
                  type="button"
                  className="data-table-card-title cursor-pointer bg-transparent text-left"
                  onClick={() => setOpenId(open ? null : alert.id)}
                  aria-expanded={open}
                >
                  {title}
                </button>
                <span
                  className={`data-table-card-badge whitespace-nowrap ${outcomeClass(alert.outcome)}`}
                >
                  {formatAlertOutcome(alert.outcome)}
                </span>
              </div>

              <div className="data-table-card-badges">
                <span
                  className={`data-table-card-badge whitespace-nowrap ${sourceBadgeClass(alert)}`}
                >
                  {formatIngestSource(ingestSource)}
                </span>
                <span className="data-table-card-badge">{formatAlertSourceLabel(alert)}</span>
              </div>

              <dl className="data-table-card-meta">
                <div className="data-table-card-meta-row">
                  <dt>Time</dt>
                  <dd>{new Date(alert.created_at).toLocaleString()}</dd>
                </div>
                {ingestSource === 'desktop' ? (
                  <div className="data-table-card-meta-row">
                    <dt>Platform</dt>
                    <dd>{formatPlatform(alert.platform)}</dd>
                  </div>
                ) : (
                  <div className="data-table-card-meta-row">
                    <dt>Webhook</dt>
                    <dd>
                      {alert.webhook_id ? `ID ${alert.webhook_id.slice(0, 8)}` : 'Inbound webhook'}
                      {alert.source_ip ? ` · ${alert.source_ip}` : ''}
                    </dd>
                  </div>
                )}
                <div className="data-table-card-meta-row">
                  <dt>Reason</dt>
                  <dd>{alert.skip_reason ?? '—'}</dd>
                </div>
                {alert.trade_status ? (
                  <div className="data-table-card-meta-row">
                    <dt>Trade status</dt>
                    <dd>{alert.trade_status}</dd>
                  </div>
                ) : null}
              </dl>

              <p className={`mt-3 text-sm text-[var(--sea-ink-soft)] ${open ? '' : 'line-clamp-3'}`}>
                {alert.text}
              </p>

              {alert.trade_id ? (
                <Link
                  to="/dashboard"
                  search={{ trade: alert.trade_id }}
                  className="mt-3 inline-block text-xs font-semibold text-[var(--ja-black)] underline"
                >
                  View trade
                </Link>
              ) : null}

              {open ? (
                <div className="mt-3">
                  <JsonPayloadViewer raw={alert.raw_payload ?? ''} />
                </div>
              ) : null}
            </article>
          )
        })}
      </div>

      <div className="data-table-scroll hidden md:block">
        <table className="data-table min-w-[48rem] text-left text-sm">
          <thead className="bg-[var(--chip-bg)] text-[var(--sea-ink-soft)]">
            <tr>
              <th className="px-3 py-2 font-semibold">
                <button type="button" className="cursor-pointer bg-transparent" onClick={() => setSortAsc((v) => !v)}>
                  Time{sortAsc ? ' ↑' : ' ↓'}
                </button>
              </th>
              <th className="px-3 py-2 font-semibold">Source</th>
              <th className="px-3 py-2 font-semibold">Title</th>
              <th className="px-3 py-2 font-semibold whitespace-nowrap">Outcome</th>
              <th className="px-3 py-2 font-semibold">Reason</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((alert) => {
              const open = openId === alert.id
              const ingestSource = resolveIngestSource(alert)
              return (
                <tr key={alert.id} className="border-t border-[var(--line)] align-top">
                  <td className="whitespace-nowrap px-3 py-2">{new Date(alert.created_at).toLocaleString()}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block whitespace-nowrap border-2 border-[var(--ja-black)] px-2 py-0.5 text-xs font-bold ${sourceBadgeClass(alert)}`}
                      >
                        {formatIngestSource(ingestSource)}
                      </span>
                    </div>
                    <div className="mt-1 font-medium text-[var(--sea-ink)]">{formatAlertSourceLabel(alert)}</div>
                    {ingestSource === 'desktop' ? (
                      <div className="text-xs text-[var(--sea-ink-soft)]">{formatPlatform(alert.platform)}</div>
                    ) : (
                      <div className="text-xs text-[var(--sea-ink-soft)]">
                        {alert.webhook_id ? `ID ${alert.webhook_id.slice(0, 8)}` : 'Inbound webhook'}
                        {alert.source_ip ? ` · ${alert.source_ip}` : ''}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      className="cursor-pointer bg-transparent text-left font-medium text-[var(--sea-ink)]"
                      onClick={() => setOpenId(open ? null : alert.id)}
                      aria-expanded={open}
                    >
                      {alert.title || (ingestSource === 'webhook' ? formatWebhookLabel(alert) : 'Untitled alert')}
                    </button>
                    <p className={`mt-1 max-w-xl text-[var(--sea-ink-soft)] ${open ? '' : 'line-clamp-2'}`}>
                      {alert.text}
                    </p>
                    {open ? (
                      <div className="mt-3 max-w-3xl">
                        <JsonPayloadViewer raw={alert.raw_payload ?? ''} />
                      </div>
                    ) : null}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    <span
                      className={`inline-block whitespace-nowrap border-2 border-[var(--ja-black)] px-2 py-0.5 text-xs font-bold ${outcomeClass(alert.outcome)}`}
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
    </>
  )
}
