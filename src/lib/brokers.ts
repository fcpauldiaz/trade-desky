export type BrokerLogo = {
  slug: 'tradier' | 'schwab' | 'ninjatrader'
  name: string
  src: string
  alt: string
}

export const BROKER_LOGOS: readonly BrokerLogo[] = [
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
] as const
