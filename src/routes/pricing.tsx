import { createFileRoute, Link, Navigate } from '@tanstack/react-router'
import HeroHighlight from '#/components/marketing/HeroHighlight'
import SocialProof from '#/components/marketing/SocialProof'
import FaqSection from '#/components/marketing/FaqSection'
import FinalCta from '#/components/marketing/FinalCta'
import JsonLd from '#/components/JsonLd'
import { showPricingForUser } from '#/lib/pricing-visibility'
import { useCanProcessTrades } from '#/lib/use-can-process-trades'
import { faqPageJsonLd, HOME_FAQ, softwareApplicationJsonLd } from '#/lib/json-ld'
import { pageHead } from '#/lib/seo'
import { PRO_PRICE_LABEL, PRO_YEARLY_PRICE_LABEL, SUPPORT_EMAIL } from '#/lib/site'

export const Route = createFileRoute('/pricing')({
  head: () =>
    pageHead({
      title: `Trade Desky pricing — Pro by invitation`,
      description: `Trade Desky Pro includes desktop alert capture, AI parsing, and Tradier or Schwab execution. Access is granted by invitation.`,
      path: '/pricing',
    }),
  component: PricingPage,
})

const PRO_FEATURES = [
  'AI trade parsing + execution',
  'Paper and live trading',
  'Desktop app automation',
  'Performance dashboards',
] as const

const BEFORE_ITEMS = [
  { icon: '⌕', text: 'Manually copying Discord alerts into your broker' },
  { icon: '⏱', text: 'Missing fills while switching apps' },
  { icon: '⚠', text: 'No option-chain validation before orders' },
  { icon: '▤', text: 'Tracking P&L in spreadsheets' },
] as const

const WITH_ITEMS = [
  { icon: '✓', text: 'Desktop app captures alerts automatically' },
  { icon: '⚡', text: 'AI parses intent and brokers execute' },
  { icon: '◆', text: 'Strike, expiry, and liquidity checked live' },
  { icon: '▣', text: 'P&L calendar and trade history built in' },
] as const

const ADVANTAGE_FEATURES = [
  {
    title: 'Desktop alert capture',
    description:
      'macOS and Windows notifications forward automatically — sign in once, no webhook URLs to copy.',
  },
  {
    title: 'Head start on every alert',
    description:
      'Parsing and execution start as soon as the notification lands, before you finish switching apps.',
  },
  {
    title: 'Broker guardrails',
    description:
      'Connect Tradier or Schwab, size trades with caps, and run paper or live from one dashboard.',
  },
  {
    title: 'Know your results',
    description: 'Monthly P&L calendar, win rate, and full trade history stay in sync with fills.',
  },
] as const

function PricingPage() {
  const { loggedIn, canProcessTrades, isPending } = useCanProcessTrades()

  if (loggedIn && isPending) {
    return null
  }
  if (loggedIn && !canProcessTrades) {
    return <Navigate to="/onboarding" />
  }
  if (!showPricingForUser(loggedIn, canProcessTrades)) {
    return <Navigate to="/billing" />
  }

  return (
    <main className="marketing-page">
      <JsonLd data={[softwareApplicationJsonLd(), faqPageJsonLd(HOME_FAQ)]} />
      <section className="marketing-section marketing-section-white pricing-hero">
        <div className="page-wrap px-4 sm:px-6 lg:px-8">
          <div className="pricing-hero-head">
            <h1 className="marketing-hero-title pricing-hero-title">
              Simple, <HeroHighlight variant="yellow">Invite-only</HeroHighlight> Pricing
            </h1>
            <p className="marketing-section-subtitle pricing-hero-sub">
              Pro includes automated alert capture and broker execution. Reference rates are{' '}
              {PRO_PRICE_LABEL}/mo or {PRO_YEARLY_PRICE_LABEL}/yr — access is granted by invitation,
              not self-serve checkout.
            </p>
          </div>

          <div className="pricing-plan-grid">
            <div className="pricing-plan-card">
              <div className="pricing-plan-top">
                <div>
                  <h2 className="pricing-plan-name">Monthly</h2>
                  <p className="pricing-plan-billing">Reference rate</p>
                </div>
              </div>
              <p className="pricing-plan-price">
                <span className="pricing-plan-price-main">{PRO_PRICE_LABEL}</span>
                <span className="pricing-plan-price-period">/mo</span>
              </p>
              <span className="pricing-plan-offer">Full automation</span>
              <ul className="pricing-plan-features">
                {PRO_FEATURES.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
            <div className="pricing-plan-card is-featured is-selected">
              <div className="pricing-plan-top">
                <div>
                  <h2 className="pricing-plan-name">Yearly</h2>
                  <p className="pricing-plan-billing">Reference rate</p>
                </div>
              </div>
              <p className="pricing-plan-price">
                <span className="pricing-plan-price-main">{PRO_YEARLY_PRICE_LABEL}</span>
                <span className="pricing-plan-price-period">/yr</span>
              </p>
              <span className="pricing-plan-offer">Same Pro features</span>
              <ul className="pricing-plan-features">
                {PRO_FEATURES.map((feature) => (
                  <li key={`year-${feature}`}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pricing-cta-block">
            {loggedIn ? (
              <a
                className="btn-primary btn-primary-lg pricing-cta"
                href={`mailto:${SUPPORT_EMAIL}?subject=Trade%20Desky%20Pro%20access`}
              >
                Request access
              </a>
            ) : (
              <Link to="/signup" className="btn-primary btn-primary-lg pricing-cta">
                Get Started
              </Link>
            )}
            <ul className="pricing-trust-list">
              <li>Invite-only Pro</li>
              <li>Paper and live trading</li>
              <li>Tradier &amp; Schwab</li>
            </ul>
            <div className="pricing-social-wrap">
              <SocialProof />
            </div>
          </div>
        </div>
      </section>

      <section className="marketing-section marketing-section-gray">
        <div className="page-wrap px-4 sm:px-6 lg:px-8">
          <div className="section-head">
            <p className="section-badge">Before / with Trade Desky</p>
            <h2 className="marketing-section-title">Stop babysitting every alert</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="feature-item">
              <h3 className="mb-3 text-lg font-black">Before</h3>
              <ul className="space-y-2 text-sm text-[var(--ja-gray-600)]">
                {BEFORE_ITEMS.map((item) => (
                  <li key={item.text}>
                    <span className="mr-2">{item.icon}</span>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="feature-item">
              <h3 className="mb-3 text-lg font-black">With Trade Desky</h3>
              <ul className="space-y-2 text-sm text-[var(--ja-gray-600)]">
                {WITH_ITEMS.map((item) => (
                  <li key={item.text}>
                    <span className="mr-2">{item.icon}</span>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="marketing-section marketing-section-white">
        <div className="page-wrap px-4 sm:px-6 lg:px-8">
          <div className="section-head">
            <p className="section-badge">Included</p>
            <h2 className="marketing-section-title">What Pro unlocks</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {ADVANTAGE_FEATURES.map((feature) => (
              <div key={feature.title} className="feature-item">
                <h3 className="mb-2 text-base font-black">{feature.title}</h3>
                <p className="text-sm text-[var(--ja-gray-600)]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FaqSection />
      <FinalCta />
    </main>
  )
}
