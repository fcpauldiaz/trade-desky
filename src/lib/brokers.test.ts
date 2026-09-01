import { describe, expect, it } from 'vitest'

import { BROKER_LOGOS, NINJATRADER_BRIDGE_DOCS_URL } from '#/lib/brokers'

describe('brokers', () => {
  it('lists official Tradier, Schwab, and NinjaTrader logo assets', () => {
    expect(BROKER_LOGOS).toEqual([
      {
        slug: 'tradier',
        name: 'Tradier',
        src: '/brokers/tradier.svg',
        alt: 'Tradier',
      },
      {
        slug: 'schwab',
        name: 'Schwab',
        src: '/brokers/schwab.jpg',
        alt: 'Charles Schwab Corporation',
      },
      {
        slug: 'ninjatrader',
        name: 'NinjaTrader',
        src: '/brokers/ninjatrader.png',
        alt: 'NinjaTrader',
      },
    ])
  })

  it('points NinjaTrader bridge docs at the standalone repo', () => {
    expect(NINJATRADER_BRIDGE_DOCS_URL).toContain('trade-desky-ninjatrader')
  })
})
