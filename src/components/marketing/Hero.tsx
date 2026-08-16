import { Link } from '@tanstack/react-router'

import HeroHighlight from '#/components/marketing/HeroHighlight'
import SocialProof from '#/components/marketing/SocialProof'
import { showPricingForUser } from '#/lib/pricing-visibility'
import { useCanProcessTrades } from '#/lib/use-can-process-trades'

export default function Hero() {
  const { loggedIn, canProcessTrades } = useCanProcessTrades()
  const showPricing = showPricingForUser(loggedIn, canProcessTrades)
  return (
    <section className="marketing-hero">
      <div className="page-wrap px-4 sm:px-6 lg:px-8">
        <div className="marketing-hero-inner">
          <div>
            <span className="marketing-badge">Discord alerts → executed trades</span>
            <h1 className="marketing-hero-title">
              Turn notification alerts into{' '}
              <HeroHighlight variant="yellow">broker orders</HeroHighlight>{' '}
              <HeroHighlight variant="pink">automatically</HeroHighlight>
            </h1>
            <p className="marketing-hero-lead">
              Install the desktop app —{' '}
              <strong className="marketing-hero-emphasis">sign in once</strong> — and let AI handle
              the rest.
            </p>
            <p className="marketing-hero-sub">
              Parse Discord-style alerts, validate option chains, and route orders to Schwab or
              Tradier — paper or live.
            </p>
            <div className="marketing-hero-actions">
              <Link to="/signup" className="btn-primary btn-primary-lg">
                Get started — automate alerts
              </Link>
              {showPricing ? (
                <Link to="/pricing" className="btn-secondary">
                  View pricing
                </Link>
              ) : null}
            </div>
            <SocialProof />
            <p className="marketing-hero-note">Set up in minutes. No webhook URLs to copy.</p>
          </div>
          <div className="marketing-hero-visual">
            <div className="marketing-hero-card-shadow" aria-hidden="true" />
            <div className="marketing-hero-card">
              <h3>How a trade flows</h3>
              <ul>
                <li>1. Desktop app captures the alert</li>
                <li>2. AI parses strike, expiry, action</li>
                <li>3. Chain validation runs</li>
                <li>4. Broker places the order</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
