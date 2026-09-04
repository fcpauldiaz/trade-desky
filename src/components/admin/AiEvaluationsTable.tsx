import DecisionChip from '#/components/admin/DecisionChip'
import type { AdminAiEvaluation } from '#/lib/api-client'
import { useState } from 'react'

type Props = {
  items: AdminAiEvaluation[]
  emptyLabel?: string
  showUser?: boolean
}

function formatCost(value: number | null): string {
  if (value == null) return '—'
  return `$${value.toFixed(6)}`
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

export default function AiEvaluationsTable({
  items,
  emptyLabel = 'No evaluations',
  showUser = true,
}: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (items.length === 0) {
    return <p className="text-sm text-[var(--ja-gray-600)]">{emptyLabel}</p>
  }

  return (
    <>
      <div className="data-table-card-list md:hidden" aria-label="AI evaluations">
        {items.map((row) => {
          const expanded = expandedId === row.id
          const rationale = row.rationale || ''
          const truncated = rationale.length > 120 && !expanded
          return (
            <article
              key={row.id}
              className="data-table-card"
              onClick={() => setExpandedId(expanded ? null : row.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  setExpandedId(expanded ? null : row.id)
                }
              }}
              role="button"
              tabIndex={0}
            >
              <div className="data-table-card-head">
                <h3 className="data-table-card-title">{showUser ? row.user_email : row.kind}</h3>
                <DecisionChip decision={row.decision} />
              </div>
              <div className="data-table-card-badges">
                <span className="data-table-card-badge">{row.kind}</span>
                {row.model ? <span className="data-table-card-badge">{row.model}</span> : null}
              </div>
              <dl className="data-table-card-meta">
                <div className="data-table-card-meta-row">
                  <dt>Time</dt>
                  <dd>{formatTime(row.created_at)}</dd>
                </div>
                {showUser ? (
                  <div className="data-table-card-meta-row">
                    <dt>Kind</dt>
                    <dd>{row.kind}</dd>
                  </div>
                ) : null}
                <div className="data-table-card-meta-row">
                  <dt>Tokens</dt>
                  <dd>
                    {row.prompt_tokens ?? '—'}/{row.completion_tokens ?? '—'}/{row.total_tokens ?? '—'}
                  </dd>
                </div>
                <div className="data-table-card-meta-row">
                  <dt>Cost</dt>
                  <dd>{formatCost(row.cost_usd)}</dd>
                </div>
                <div className="data-table-card-meta-row">
                  <dt>Latency</dt>
                  <dd>{row.latency_ms != null ? `${row.latency_ms}ms` : '—'}</dd>
                </div>
              </dl>
              <p className={`mt-3 text-xs text-[var(--ja-gray-600)] ${expanded ? '' : 'line-clamp-3'}`}>
                {truncated ? `${rationale.slice(0, 120)}…` : rationale || '—'}
              </p>
            </article>
          )
        })}
      </div>

      <div className="admin-table-wrap hidden md:block">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Time</th>
              {showUser ? <th>User</th> : null}
              <th>Kind</th>
              <th>Decision</th>
              <th>Rationale</th>
              <th>Tokens</th>
              <th>Cost</th>
              <th>Latency</th>
              <th>Model</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => {
              const expanded = expandedId === row.id
              const rationale = row.rationale || ''
              const truncated = rationale.length > 80 && !expanded
              return (
                <tr
                  key={row.id}
                  className="admin-table-row"
                  onClick={() => setExpandedId(expanded ? null : row.id)}
                >
                  <td className="whitespace-nowrap text-xs">{formatTime(row.created_at)}</td>
                  {showUser ? (
                    <td className="text-xs">
                      <div className="font-semibold">{row.user_email}</div>
                    </td>
                  ) : null}
                  <td className="text-xs">{row.kind}</td>
                  <td>
                    <DecisionChip decision={row.decision} />
                  </td>
                  <td className="max-w-[16rem] text-xs">
                    {truncated ? `${rationale.slice(0, 80)}…` : rationale || '—'}
                  </td>
                  <td className="whitespace-nowrap text-xs tabular-nums">
                    {row.prompt_tokens ?? '—'}/{row.completion_tokens ?? '—'}/
                    {row.total_tokens ?? '—'}
                  </td>
                  <td className="whitespace-nowrap text-xs tabular-nums">{formatCost(row.cost_usd)}</td>
                  <td className="whitespace-nowrap text-xs tabular-nums">
                    {row.latency_ms != null ? `${row.latency_ms}ms` : '—'}
                  </td>
                  <td className="max-w-[10rem] truncate text-xs">{row.model || '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
