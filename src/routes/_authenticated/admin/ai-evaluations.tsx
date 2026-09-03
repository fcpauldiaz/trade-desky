import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import AiEvaluationsTable from '#/components/admin/AiEvaluationsTable'
import { api, type AdminAiEvaluationPage } from '#/lib/api-client'

export const Route = createFileRoute('/_authenticated/admin/ai-evaluations')({
  component: AdminAiEvaluationsPage,
})

const PAGE_SIZE = 50

function AdminAiEvaluationsPage() {
  const [kind, setKind] = useState('')
  const [decision, setDecision] = useState('')
  const [email, setEmail] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [offset, setOffset] = useState(0)
  const [applied, setApplied] = useState({
    kind: '',
    decision: '',
    email: '',
    from: '',
    to: '',
  })
  const [page, setPage] = useState<AdminAiEvaluationPage | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    api
      .adminAiEvaluations({
        kind: applied.kind || undefined,
        decision: applied.decision || undefined,
        email: applied.email || undefined,
        from: applied.from || undefined,
        to: applied.to || undefined,
        limit: PAGE_SIZE,
        offset,
      })
      .then((data) => {
        if (!cancelled) setPage(data)
      })
      .catch(() => {
        if (!cancelled) setError('Could not load evaluations')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [applied, offset])

  function applyFilters() {
    setOffset(0)
    setApplied({ kind, decision, email, from, to })
  }

  function clearFilters() {
    setKind('')
    setDecision('')
    setEmail('')
    setFrom('')
    setTo('')
    setOffset(0)
    setApplied({ kind: '', decision: '', email: '', from: '', to: '' })
  }

  return (
    <div className="admin-fade space-y-4">
      <div className="admin-filter-bar">
        <label className="admin-filter-field">
          Kind
          <select value={kind} onChange={(e) => setKind(e.target.value)} className="demo-input">
            <option value="">All</option>
            <option value="parse">parse</option>
            <option value="filter">filter</option>
          </select>
        </label>
        <label className="admin-filter-field">
          Decision
          <select
            value={decision}
            onChange={(e) => setDecision(e.target.value)}
            className="demo-input"
          >
            <option value="">All</option>
            <option value="take">take</option>
            <option value="skip">skip</option>
            <option value="error">error</option>
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
        <div className="flex flex-wrap items-end gap-2">
          <button type="button" className="btn-primary btn-sm" onClick={applyFilters}>
            Apply
          </button>
          <button type="button" className="btn-secondary btn-sm" onClick={clearFilters}>
            Clear
          </button>
        </div>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {loading ? <p className="text-sm text-[var(--ja-gray-600)]">Loading…</p> : null}
      {page && !loading ? (
        <>
          <AiEvaluationsTable items={page.items} />
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <p className="text-[var(--ja-gray-600)]">
              {page.total} total · filter cost ${page.cost_usd_sum.toFixed(4)}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className="btn-secondary btn-sm"
                disabled={offset === 0}
                onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
              >
                Prev
              </button>
              <button
                type="button"
                className="btn-secondary btn-sm"
                disabled={offset + PAGE_SIZE >= page.total}
                onClick={() => setOffset(offset + PAGE_SIZE)}
              >
                Next
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
