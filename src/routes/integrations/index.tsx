import { createFileRoute, Link } from '@tanstack/react-router'

import SeoPage, { RelatedPages, SeoSection } from '#/components/marketing/SeoPage'
import { breadcrumbJsonLd } from '#/lib/json-ld'
import { pageHead } from '#/lib/seo'
import { PRO_PRICE_LABEL } from '#/lib/site'

export const Route = createFileRoute('/integrations/')({
  head: () =>
    pageHead({
      title: 'Trade Desky integrations — Tradier, Schwab, Discord alerts',
      description:
        'Connect Tradier or Schwab and capture Discord-style desktop notifications. No webhook URL. Paper on Tradier sandbox; live on Tradier or Schwab.',
      path: '/integrations',
    }),
  component: IntegrationsIndexPage,
})

function IntegrationsIndexPage() {
  return (
    <SeoPage
      title="Integrations"
      lede="Alert capture on your machine. Broker execution in your account. That is the whole stack today."
      jsonLd={breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Integrations', path: '/integrations' },
      ])}
    >
      <SeoSection title="What is live">
        <ul className="list-disc space-y-2 pl-5 text-sm">
          <li>
            <Link className="font-semibold underline" to="/integrations/discord">
              Discord-style alerts
            </Link>{' '}
            via Notification Watcher (macOS and Windows). We read OS notifications, not a Discord bot
            invite.
          </li>
          <li>
            <Link className="font-semibold underline" to="/integrations/tradier">
              Tradier
            </Link>{' '}
            with a sandbox token for paper or a production token for live. Partner OAuth is optional.
          </li>
          <li>
            <Link className="font-semibold underline" to="/integrations/schwab">
              Charles Schwab
            </Link>{' '}
            via official OAuth. There is no Schwab paper toggle in the app.
          </li>
        </ul>
      </SeoSection>
      <SeoSection title="What is not live">
        <p className="text-sm">
          Webull, tastytrade, Interactive Brokers, TradingView webhooks, and Telegram are not
          connected. If a competitor page lists them, that is their product, not ours. Pro is{' '}
          {PRO_PRICE_LABEL}/mo on <Link to="/pricing">pricing</Link>.
        </p>
      </SeoSection>
      <RelatedPages
        links={[
          { to: '/integrations/tradier', label: 'Tradier setup' },
          { to: '/integrations/schwab', label: 'Schwab setup' },
          { to: '/integrations/discord', label: 'Desktop Discord alerts' },
          { to: '/compare', label: 'Compare alternatives' },
        ]}
      />
    </SeoPage>
  )
}
