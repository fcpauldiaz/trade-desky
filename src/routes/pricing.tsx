import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import HeroHighlight from '#/components/marketing/HeroHighlight'
import SocialProof from '#/components/marketing/SocialProof'
import FaqSection from '#/components/marketing/FaqSection'
import FinalCta from '#/components/marketing/FinalCta'
import { checkoutUrl } from '#/lib/lemon-squeezy'
import { useSession } from '#/lib/auth-client'
import { api } from '#/lib/api-client'

export const Route = createFileRoute('/pricing')({ component: PricingPage })

type PlanId = 'free' | 'pro'

const PLANS = [
  {
    id: 'free' as const,
    name: 'Free',
    billing: 'Explore the platform',
    price: '$0',
    period: '/mo',
    features: ['Dashboard access', 'No trade processing', 'No desktop automation'],
  },
  {
    id: 'pro' as const,
    name: 'Pro',
    billing: 'Billed monthly via Lemon Squeezy',
    price: 'Pro',
    period: ' plan',
    badge: 'Most Popular',
    offer: 'Full automation',
    featured: true,
    features: [
      'AI trade parsing + execution',
      'Paper and live trading',
      'Desktop app automation',
      'Performance dashboards',
    ],
  },
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
  const { data: session } = useSession()
  const [userId, setUserId] = useState('')
  const [email, setEmail] = useState('')
  const [selected, setSelected] = useState<PlanId>('pro')

  useEffect(() => {
    if (!session?.user) return
    api
      .me()
      .then((u) => {
        setUserId(u.id)
        setEmail(u.email)
      })
      .catch(() => {})
  }, [session?.user])

  function renderCta() {
    if (selected === 'free') {
      return (
        <Link to="/signup" className="btn-primary btn-primary-lg pricing-cta">
          Get Started
        </Link>
      )
    }
    if (session?.user && userId) {
      return (
        <a href={checkoutUrl(userId, email)} className="btn-primary btn-primary-lg pricing-cta">
          Get Started
        </a>
      )
    }
    return (
      <Link to="/login" className="btn-primary btn-primary-lg pricing-cta">
        Get Started
      </Link>
    )
  }

  return (
    <main className="marketing-page">
      <section className="marketing-section marketing-section-white pricing-hero">
        <div className="page-wrap px-4 sm:px-6 lg:px-8">
          <div className="pricing-hero-head">
            <h1 className="marketing-hero-title pricing-hero-title">
              Simple, <HeroHighlight variant="yellow">Transparent</HeroHighlight> Pricing
            </h1>
            <p className="marketing-section-subtitle pricing-hero-sub">
              Start free, upgrade when you are ready to automate execution. Cancel anytime.
            </p>
          </div>

          <div className="pricing-plan-grid" role="radiogroup" aria-label="Choose a plan">
            {PLANS.map((plan) => {
              const isSelected = selected === plan.id
              return (
                <button
                  key={plan.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  className={`pricing-plan-card${'featured' in plan && plan.featured ? ' is-featured' : ''}${isSelected ? ' is-selected' : ''}`}
                  onClick={() => setSelected(plan.id)}
                >
                  {'badge' in plan && plan.badge ? (
                    <span className="pricing-plan-badge">{plan.badge}</span>
                  ) : null}
                  <div className="pricing-plan-top">
                    <div>
                      <h2 className="pricing-plan-name">{plan.name}</h2>
                      <p className="pricing-plan-billing">{plan.billing}</p>
                    </div>
                    <span className="pricing-plan-radio" aria-hidden="true">
                      {isSelected ? '✓' : ''}
                    </span>
                  </div>
                  <p className="pricing-plan-price">
                    <span className="pricing-plan-price-main">{plan.price}</span>
                    {plan.period ? <span className="pricing-plan-price-period">{plan.period}</span> : null}
                  </p>
                  {'offer' in plan && plan.offer ? (
                    <span className="pricing-plan-offer">{plan.offer}</span>
                  ) : null}
                  <ul className="pricing-plan-features">
                    {plan.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </button>
              )
            })}
          </div>

          <div className="pricing-cta-block">
            {renderCta()}
            <ul className="pricing-trust-list">
              <li>Cancel anytime</li>
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
            <h2 className="marketing-section-title">
              What you get with <HeroHighlight variant="yellow">Trade Platform</HeroHighlight>
            </h2>
          </div>
          <div className="pricing-compare-grid">
            <article className="pricing-compare-card pricing-compare-before">
              <span className="pricing-compare-tag">Before</span>
              <ul className="pricing-compare-list">
                {BEFORE_ITEMS.map((item) => (
                  <li key={item.text}>
                    <span className="pricing-compare-icon" aria-hidden="true">
                      {item.icon}
                    </span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </article>
            <article className="pricing-compare-card pricing-compare-with">
              <span className="pricing-compare-tag pricing-compare-tag-with">With Trade Platform</span>
              <ul className="pricing-compare-list">
                {WITH_ITEMS.map((item) => (
                  <li key={item.text}>
                    <span className="pricing-compare-icon pricing-compare-icon-with" aria-hidden="true">
                      {item.icon}
                    </span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
          <div className="pricing-mid-cta">{renderCta()}</div>
        </div>
      </section>

      <section className="marketing-section marketing-section-white">
        <div className="page-wrap px-4 sm:px-6 lg:px-8">
          <div className="section-head">
            <h2 className="marketing-section-title">Your advantage over time</h2>
            <p className="marketing-section-subtitle">
              Traders who automate alert capture spend less time babysitting Discord and more time
              managing risk. Pro unlocks execution; Free lets you explore the dashboard first.
            </p>
          </div>
          <div className="pricing-advantage-list">
            {ADVANTAGE_FEATURES.map((feature) => (
              <article key={feature.title} className="pricing-advantage-item">
                <div className="pricing-advantage-mark" aria-hidden="true" />
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="pricing-mid-cta">
            <p className="pricing-mid-cta-label">Maximize your alert-to-fill speed</p>
            {renderCta()}
          </div>
        </div>
      </section>

      <FaqSection />
      <FinalCta />
    </main>
  )
}
