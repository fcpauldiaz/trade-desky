import { useEffect, useMemo, useRef, useState } from 'react'
import type { Trade } from '#/lib/api-client'

type SortKey = keyof Pick<Trade, 'created_at' | 'underlying' | 'strike' | 'mode' | 'status' | 'pnl'>

type TradeTableProps = {
  trades: Trade[]
  highlightTradeId?: string
}

export default function TradeTable({ trades, highlightTradeId }: TradeTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('created_at')
  const [asc, setAsc] = useState(false)
  const highlightRef = useRef<HTMLTableRowElement>(null)

  useEffect(() => {
    if (highlightTradeId && highlightRef.current) {
      highlightRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
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

  const headers: Array<{ key: SortKey; label: string }> = [
    { key: 'created_at', label: 'Time' },
    { key: 'underlying', label: 'Underlying' },
    { key: 'strike', label: 'Strike' },
    { key: 'mode', label: 'Mode' },
    { key: 'status', label: 'Status' },
    { key: 'pnl', label: 'P&L' },
  ]

  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--line)]">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-[var(--chip-bg)] text-[var(--sea-ink-soft)]">
          <tr>
            {headers.map(({ key, label }) => (
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
          {sorted.map((t) => (
            <tr
              key={t.id}
              ref={t.id === highlightTradeId ? highlightRef : undefined}
              className={`border-t border-[var(--line)] ${t.id === highlightTradeId ? 'bg-[var(--ja-yellow)]' : ''}`}
            >
              <td className="px-3 py-2">{new Date(t.created_at).toLocaleString()}</td>
              <td className="px-3 py-2 font-medium text-[var(--sea-ink)]">{t.underlying}</td>
              <td className="px-3 py-2">{t.strike}</td>
              <td className="px-3 py-2">{t.mode}</td>
              <td className="px-3 py-2">{t.status}</td>
              <td className={`px-3 py-2 ${(t.pnl ?? 0) >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                {t.pnl?.toFixed(2) ?? '—'}
              </td>
              <td className="px-3 py-2">{t.option_type}</td>
              <td className="px-3 py-2">{t.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
