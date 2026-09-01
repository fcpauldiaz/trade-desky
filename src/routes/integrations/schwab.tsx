import { createFileRoute, Link } from '@tanstack/react-router'

import SeoPage, { RelatedPages, SeoSection } from '#/components/marketing/SeoPage'
import { breadcrumbJsonLd, faqPageJsonLd } from '#/lib/json-ld'
import { pageHead } from '#/lib/seo'

const FAQ = [
  {
    q: 'Does Schwab paper trading work in Trade Desky?',
    a: 'The app’s Schwab button is OAuth to your Schwab brokerage account. There is no Schwab paper environment toggle. Use Tradier sandbox if you need paper fills first.',
  },
  {
    q: 'Do you store my Schwab password?',
    a: 'No. You sign in at Schwab. We store encrypted OAuth tokens after the redirect.',
  },
  {
    q: 'Can I automate Discord options alerts to Schwab?',
    a: 'Yes, once Trade Desky Watcher is signed in and Schwab is connected. Alerts still have to parse and pass chain validation.',
  },
] as const

export const Route = createFileRoute('/integrations/schwab')({
  head: () =>
    pageHead({
      title: 'Schwab Discord options automation',
      description:
        'Connect Charles Schwab with OAuth and route parsed desktop alerts to your account. No API key to paste. Paper trading stays on Tradier sandbox.',
      path: '/integrations/schwab',
    }),
  component: SchwabIntegrationPage,
})

function SchwabIntegrationPage() {
  return (
    <SeoPage
      title="Route Discord option alerts to Charles Schwab"
      lede="Schwab is the live OAuth path. You never paste a Schwab API key into Trade Desky. Password stays on schwab.com."
      jsonLd={[
        breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Integrations', path: '/integrations' },
          { name: 'Schwab', path: '/integrations/schwab' },
        ]),
        faqPageJsonLd(FAQ),
      ]}
    >
      <SeoSection title="Why OAuth instead of a token">
        <p className="text-sm">
          Schwab’s retail API is built around an authorize redirect. On Connections, Authorize
          Schwab sends you to Schwab, then back to Trade Desky with tokens we encrypt at rest.
        </p>
      </SeoSection>
      <SeoSection title="Connect Schwab">
        <ol className="list-decimal space-y-2 pl-5 text-sm">
          <li>
            Start from <Link to="/pricing">Pro</Link> so broker connect is unlocked.
          </li>
          <li>
            Open <Link to="/connections">Connections</Link> and choose Authorize Schwab.
          </li>
          <li>Approve access on Schwab’s site. Complete onboarding and a test order if offered.</li>
          <li>
            Keep Trade Desky Watcher running on the machine that sees Discord (or any other)
            banners.
          </li>
        </ol>
      </SeoSection>
      <SeoSection title="Limits">
        <p className="text-sm">
          Futures and crypto are not in this integration. If Schwab’s API rejects an order type, we
          surface that on the trade — we do not silently rewrite it into a different product.
        </p>
      </SeoSection>
      <details className="feature-item">
        <summary className="font-black">Schwab FAQ</summary>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
          {FAQ.map((item) => (
            <li key={item.q}>
              <strong>{item.q}</strong> {item.a}
            </li>
          ))}
        </ul>
      </details>
      <RelatedPages
        links={[
          { to: '/integrations/tradier', label: 'Tradier paper + live' },
          { to: '/integrations/ninjatrader', label: 'NinjaTrader futures' },
          { to: '/integrations/discord', label: 'How alerts are captured' },
          { to: '/compare/tradelabs', label: 'TradeLabs vs Trade Desky' },
        ]}
      />
    </SeoPage>
  )
}
