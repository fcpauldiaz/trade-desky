import { useEffect, useMemo, useRef, useState } from 'react'
import type { Trade } from '#/lib/api-client'

type SortKey = keyof Pick<Trade, 'created_at' | 'underlying' | 'strike' | 'mode' | 'status' | 'pnl'>

type TradeTableProps = {
  trades: Trade[]
  highlightTradeId?: string
}

const HEADERS: Array<{ key: SortKey; label: string }> = [
  { key: 'created_at', label: 'Time' },
  { key: 'underlying', label: 'Underlying' },
  { key: 'strike', label: 'Strike' },
  { key: 'mode', label: 'Mode' },
  { key: 'status', label: 'Status' },
  { key: 'pnl', label: 'P&L' },
]

function formatPnl(value: number | null): string {
  return value?.toFixed(2) ?? '—'
}

function pnlClass(value: number | null): string {
  if (value == null) return ''
  return value >= 0 ? 'is-positive' : 'is-negative'
}

export default function TradeTable({ trades, highlightTradeId }: TradeTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('created_at')
  const [asc, setAsc] = useState(false)
  const highlightRef = useRef<HTMLTableRowElement>(null)
  const highlightCardRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!highlightTradeId) return
    highlightRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    highlightCardRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [highlightTradeId, trades])

  const sorted = useMemo(() => {
    const copy = [...trades]
    copy.sort((a, b) => {
      const av = a[sortKey] ?? ''
      const bv = b[sortKey] ?? ''
      if (av < bv) return asc ? -1 : 1
      if (av > bv) return asc ? 1 : -1
      return 0
    })
    return copy
  }, [trades, sortKey, asc])

  function toggleSort(key: SortKey) {
    if (sortKey === key) setAsc(!asc)
    else {
      setSortKey(key)
      setAsc(false)
    }
  }

  if (!trades.length) {
    return <p className="text-sm text-[var(--sea-ink-soft)]">No trades yet.</p>
  }

  const mobileSortValue = `${sortKey}:${asc ? 'asc' : 'desc'}`

  return (
    <>
      <div className="data-table-mobile-toolbar md:hidden">
        <label>
          Sort
          <select
            value={mobileSortValue}
            onChange={(event) => {
              const [key, direction] = event.target.value.split(':') as [SortKey, 'asc' | 'desc']
              setSortKey(key)
              setAsc(direction === 'asc')
            }}
          >
            {HEADERS.map(({ key, label }) => (
              <option key={`${key}-desc`} value={`${key}:desc`}>
                {label} (newest/high first)
              </option>
            ))}
            {HEADERS.map(({ key, label }) => (
              <option key={`${key}-asc`} value={`${key}:asc`}>
                {label} (oldest/low first)
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="data-table-card-list md:hidden" aria-label="Recent trades">
        {sorted.map((trade) => {
          const highlighted = trade.id === highlightTradeId
          return (
            <article
              key={trade.id}
              ref={highlighted ? highlightCardRef : undefined}
              className={`data-table-card${highlighted ? ' is-highlighted' : ''}`}
            >
              <div className="data-table-card-head">
                <h3 className="data-table-card-title">{trade.underlying}</h3>
                <span className={`data-table-card-metric ${pnlClass(trade.pnl)}`}>
                  {formatPnl(trade.pnl)}
                </span>
              </div>
              <div className="data-table-card-badges">
                <span className="data-table-card-badge">{trade.status}</span>
                <span className="data-table-card-badge">{trade.mode}</span>
                <span className="data-table-card-badge">{trade.option_type}</span>
              </div>
              <dl className="data-table-card-meta">
                <div className="data-table-card-meta-row">
                  <dt>Time</dt>
                  <dd>{new Date(trade.created_at).toLocaleString()}</dd>
                </div>
                <div className="data-table-card-meta-row">
                  <dt>Strike</dt>
                  <dd>{trade.strike}</dd>
                </div>
                <div className="data-table-card-meta-row">
                  <dt>Qty</dt>
                  <dd>{trade.quantity}</dd>
                </div>
              </dl>
            </article>
          )
        })}
      </div>

      <div className="data-table-scroll hidden md:block">
        <table className="data-table min-w-[40rem] text-left text-sm">
          <thead className="bg-[var(--chip-bg)] text-[var(--sea-ink-soft)]">
            <tr>
              {HEADERS.map(({ key, label }) => (
                <th key={key} className="px-3 py-2 font-semibold">
                  <button type="button" className="cursor-pointer bg-transparent" onClick={() => toggleSort(key)}>
                    {label}
                    {sortKey === key ? (asc ? ' ↑' : ' ↓') : ''}
                  </button>
                </th>
              ))}
              <th className="px-3 py-2 font-semibold">Type</th>
              <th className="px-3 py-2 font-semibold">Qty</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((trade) => (
              <tr
                key={trade.id}
                ref={trade.id === highlightTradeId ? highlightRef : undefined}
                className={`border-t border-[var(--line)] ${trade.id === highlightTradeId ? 'bg-[var(--ja-yellow)]' : ''}`}
              >
                <td className="px-3 py-2 whitespace-nowrap">{new Date(trade.created_at).toLocaleString()}</td>
                <td className="px-3 py-2 font-medium text-[var(--sea-ink)]">{trade.underlying}</td>
                <td className="px-3 py-2">{trade.strike}</td>
                <td className="px-3 py-2">{trade.mode}</td>
                <td className="px-3 py-2">{trade.status}</td>
                <td className={`px-3 py-2 ${pnlClass(trade.pnl) === 'is-positive' ? 'text-emerald-700' : pnlClass(trade.pnl) === 'is-negative' ? 'text-red-700' : ''}`}>
                  {formatPnl(trade.pnl)}
                </td>
                <td className="px-3 py-2">{trade.option_type}</td>
                <td className="px-3 py-2">{trade.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
