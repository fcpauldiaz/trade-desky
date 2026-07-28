type Props = {
  mtdPnl: number
  totalPnl: number
  winRate: number
  totalTrades: number
  mode: string
  onModeChange: (mode: string) => void
}

export default function KpiStrip({ mtdPnl, totalPnl, winRate, totalTrades, mode, onModeChange }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <div className="island-shell rounded-xl p-4">
        <p className="text-xs text-[var(--sea-ink-soft)]">MTD P&amp;L</p>
        <p className="text-2xl font-bold text-[var(--sea-ink)]">${mtdPnl.toFixed(2)}</p>
      </div>
      <div className="island-shell rounded-xl p-4">
        <p className="text-xs text-[var(--sea-ink-soft)]">All-time P&amp;L</p>
        <p className="text-2xl font-bold text-[var(--sea-ink)]">${totalPnl.toFixed(2)}</p>
      </div>
      <div className="island-shell rounded-xl p-4">
        <p className="text-xs text-[var(--sea-ink-soft)]">Win rate</p>
        <p className="text-2xl font-bold text-[var(--sea-ink)]">{winRate.toFixed(1)}%</p>
      </div>
      <div className="island-shell rounded-xl p-4">
        <p className="text-xs text-[var(--sea-ink-soft)]">Filled trades</p>
        <p className="text-2xl font-bold text-[var(--sea-ink)]">{totalTrades}</p>
      </div>
      <div className="island-shell rounded-xl p-4">
        <p className="mb-2 text-xs text-[var(--sea-ink-soft)]">View mode</p>
        <select
          className="w-full rounded-lg border border-[var(--line)] bg-transparent px-2 py-1"
          value={mode}
          onChange={(e) => onModeChange(e.target.value)}
        >
          <option value="">All</option>
          <option value="paper">Paper</option>
          <option value="live">Live</option>
        </select>
      </div>
    </div>
  )
}
