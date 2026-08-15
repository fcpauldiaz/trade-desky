import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import HeroHighlight from '#/components/marketing/HeroHighlight'
import SocialProof from '#/components/marketing/SocialProof'
import FaqSection from '#/components/marketing/FaqSection'
import FinalCta from '#/components/marketing/FinalCta'
import { checkoutUrl } from '#/lib/creem'
import { useSession } from '#/lib/auth-client'
import { api } from '#/lib/api-client'

export const Route = createFileRoute('/pricing')({ component: PricingPage })

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
  const { data: session } = useSession()
  const [userId, setUserId] = useState('')
  const [email, setEmail] = useState('')

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
              One plan for automated alert capture and broker execution. Cancel anytime.
            </p>
          </div>

          <div className="pricing-plan-grid pricing-plan-grid-single">
            <article className="pricing-plan-card is-featured is-selected">
              <span className="pricing-plan-badge">Most Popular</span>
              <div className="pricing-plan-top">
                <div>
                  <h2 className="pricing-plan-name">Pro</h2>
                  <p className="pricing-plan-billing">Billed monthly via Creem</p>
                </div>
                <span className="pricing-plan-radio" aria-hidden="true">
                  ✓
                </span>
              </div>
              <p className="pricing-plan-price">
                <span className="pricing-plan-price-main">Pro</span>
                <span className="pricing-plan-price-period"> plan</span>
              </p>
              <span className="pricing-plan-offer">Full automation</span>
              <ul className="pricing-plan-features">
                {PRO_FEATURES.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </article>
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
              What you get with <HeroHighlight variant="yellow">Trade Desky</HeroHighlight>
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
              <span className="pricing-compare-tag pricing-compare-tag-with">With Trade Desky</span>
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
              managing risk.
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
