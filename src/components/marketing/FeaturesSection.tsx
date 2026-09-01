const FEATURES = [
  {
    icon: '1',
    title: 'Desktop alert capture',
    description: 'macOS and Windows notifications forward automatically — sign in once, no URLs to copy.',
  },
  {
    icon: '2',
    title: 'AI trade parsing',
    description: 'Alerts become structured buy/sell intents with strike, expiry, and price.',
  },
  {
    icon: '3',
    title: 'Chain validation',
    description: 'Strike, expiration, and liquidity are checked against live option chains before any order.',
  },
  {
    icon: '4',
    title: 'Multi-broker execution',
    description: 'Connect Schwab, Tradier, or NinjaTrader and trade in paper or live mode from one dashboard.',
  },
  {
    icon: '5',
    title: 'Subscription gating',
    description: 'Pro unlocks automated execution; free accounts can explore the platform.',
  },
  {
    icon: '6',
    title: 'Performance dashboard',
    description: 'P&L calendar, trade history, and sizing controls in one place.',
  },
] as const

export default function FeaturesSection() {
  return (
    <section className="marketing-section marketing-section-white">
      <div className="page-wrap px-4 sm:px-6 lg:px-8">
        <div className="section-head">
          <span className="section-badge section-badge-yellow">Features</span>
          <h2 className="marketing-section-title">Everything from alert to fill</h2>
          <p className="marketing-section-subtitle">
            Desktop capture, AI parsing, and broker execution in one product stack.
          </p>
        </div>
        <div className="feature-grid">
          {FEATURES.map((feature) => (
            <article key={feature.title} className="feature-item">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
