export function mergeHighlightedTrade<T extends { id: string }>(
  trades: T[],
  highlighted: T | null,
): T[] {
  if (!highlighted) return trades
  if (trades.some((trade) => trade.id === highlighted.id)) return trades
  return [highlighted, ...trades]
}
