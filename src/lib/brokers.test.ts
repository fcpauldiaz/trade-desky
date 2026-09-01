import { describe, expect, it } from 'vitest'

import { BROKER_LOGOS } from '#/lib/brokers'

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
        src: '/brokers/schwab.png',
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
})
