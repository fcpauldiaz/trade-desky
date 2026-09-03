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
    <div className="admin-table-wrap">
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
                <td className="text-xs">{row.model || '—'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
