import { describe, expect, it } from 'vitest'

import { mergeHighlightedTrade } from '#/lib/merge-highlighted-trade'

describe('mergeHighlightedTrade', () => {
  it('returns the list unchanged when there is no highlighted trade', () => {
    const trades = [{ id: 'a' }]
    expect(mergeHighlightedTrade(trades, null)).toBe(trades)
  })

  it('returns the list unchanged when the highlighted trade is already present', () => {
    const trades = [{ id: 'a' }, { id: 'b' }]
    expect(mergeHighlightedTrade(trades, { id: 'b' })).toEqual(trades)
  })

  it('prepends a highlighted trade that is missing from the recent list', () => {
    expect(mergeHighlightedTrade([{ id: 'a' }], { id: 'old' })).toEqual([{ id: 'old' }, { id: 'a' }])
  })
})
