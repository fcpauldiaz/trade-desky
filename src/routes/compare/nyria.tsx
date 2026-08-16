import { createFileRoute, Link } from '@tanstack/react-router'

import SeoPage, { RelatedPages, SeoSection } from '#/components/marketing/SeoPage'
import { breadcrumbJsonLd } from '#/lib/json-ld'
import { pageHead } from '#/lib/seo'
import { PRO_PRICE_LABEL } from '#/lib/site'

export const Route = createFileRoute('/compare/nyria')({
  head: () =>
    pageHead({
      title: 'Nyria alternative — Trade Desky',
      description: `Nyria meters $100 per $10k allocation and uses a Discord bot. Trade Desky is ${PRO_PRICE_LABEL}/mo with desktop notification capture for Tradier and Schwab.`,
      path: '/compare/nyria',
    }),
  component: CompareNyriaPage,
})

function CompareNyriaPage() {
  return (
    <SeoPage
      title="Nyria vs Trade Desky"
      lede="Nyria is a broader automation platform (more brokers, TradingView, creator billing). Trade Desky is a cheaper, narrower copier for Discord-style desktop alerts into Tradier or Schwab."
      jsonLd={breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Compare', path: '/compare' },
        { name: 'Nyria', path: '/compare/nyria' },
      ])}
    >
      <SeoSection title="Pricing model">
        <p className="text-sm">
          Nyria’s public Pro pricing (August 2026) is $100 per month per $10,000 of max entry
          allocation. Trade Desky Pro is a flat {PRO_PRICE_LABEL} per month, billed through Creem,
          with cancel in the customer portal.
        </p>
      </SeoSection>
      <SeoSection title="How alerts arrive">
        <p className="text-sm">
          Nyria documents inviting a Discord bot and pointing channels at a strategy. Trade Desky
          reads OS notifications through Notification Watcher. If you need channel-level bot
          monitoring without a desktop session, Nyria’s model fits better.
        </p>
      </SeoSection>
      <SeoSection title="Brokers">
        <p className="text-sm">
          Both list Schwab and Tradier. Nyria also lists tastytrade, Alpaca, and others on its
          marketing site. We do not. See{' '}
          <Link className="underline" to="/integrations">
            integrations
          </Link>
          .
        </p>
      </SeoSection>
      <RelatedPages
        links={[
          { to: '/compare/tradelabs', label: 'TradeLabs comparison' },
          { to: '/pricing', label: `${PRO_PRICE_LABEL}/mo pricing` },
          { to: '/integrations/discord', label: 'Our Discord capture' },
        ]}
      />
    </SeoPage>
  )
}
