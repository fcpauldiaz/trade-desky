import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import AiEvaluationsTable from '#/components/admin/AiEvaluationsTable'
import { api, type AdminOverview } from '#/lib/api-client'

export const Route = createFileRoute('/_authenticated/admin/')({
  component: AdminOverviewPage,
})

function formatUsd(value: number): string {
  return `$${value.toFixed(4)}`
}

function formatTokens(value: number): string {
  return value.toLocaleString()
}

function AdminOverviewPage() {
  const [data, setData] = useState<AdminOverview | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .adminOverview()
      .then(setData)
      .catch(() => setError('Could not load overview'))
  }, [])

  return (
    <div className="admin-fade space-y-8">
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {data ? (
        <>
          <section className="admin-spend">
            <div>
              <p className="admin-spend-label">AI spend today</p>
              <p className="admin-spend-value">{formatUsd(data.cost_usd_today)}</p>
              <p className="mt-1 text-sm text-[var(--ja-gray-600)]">
                {formatTokens(data.tokens_today)} tokens today
              </p>
            </div>
            <div>
              <p className="admin-spend-label">MTD</p>
              <p className="admin-spend-mtd">{formatUsd(data.cost_usd_mtd)}</p>
              <p className="mt-1 text-sm text-[var(--ja-gray-600)]">
                {formatTokens(data.tokens_mtd)} tokens MTD
              </p>
            </div>
          </section>

          <section className="admin-stat-strip" aria-label="Counts">
            <span>
              <strong>{data.user_count}</strong> users
            </span>
            <span>
              <strong>{data.active_subscription_count}</strong> active subs
            </span>
            <span>
              <strong>{data.alerts_today}</strong> alerts today
            </span>
            <span>
              <strong>{data.ai_calls_today}</strong> AI calls today
            </span>
          </section>

          <section className="space-y-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-lg font-black text-[var(--ja-black)]">Latest evaluations</h2>
              <Link to="/admin/ai-evaluations" className="text-sm font-semibold">
                View all
              </Link>
            </div>
            <AiEvaluationsTable items={data.latest_evaluations} emptyLabel="No AI calls yet" />
          </section>
        </>
      ) : !error ? (
        <p className="text-sm text-[var(--ja-gray-600)]">Loading…</p>
      ) : null}
    </div>
  )
}
