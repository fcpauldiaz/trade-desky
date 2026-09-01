import { describe, expect, it } from 'vitest'

import { BROKER_LOGOS, NINJATRADER_BRIDGE_DOCS_URL } from '#/lib/brokers'

describe('brokers', () => {
  it('lists Tradier, Schwab, and NinjaTrader logos', () => {
    const names = BROKER_LOGOS.map((b) => b.name)
    expect(names).toEqual(['Tradier', 'Schwab', 'NinjaTrader'])
    expect(BROKER_LOGOS.every((b) => b.src.startsWith('/brokers/'))).toBe(true)
  })

  it('points NinjaTrader bridge docs at the standalone repo', () => {
    expect(NINJATRADER_BRIDGE_DOCS_URL).toContain('trade-desky-ninjatrader')
  })
})
