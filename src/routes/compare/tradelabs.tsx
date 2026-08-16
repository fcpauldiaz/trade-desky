import { createFileRoute, Link } from '@tanstack/react-router'

import SeoPage, { RelatedPages, SeoSection } from '#/components/marketing/SeoPage'
import { breadcrumbJsonLd } from '#/lib/json-ld'
import { pageHead } from '#/lib/seo'
import { PRO_PRICE_LABEL } from '#/lib/site'

export const Route = createFileRoute('/compare/tradelabs')({
  head: () =>
    pageHead({
      title: 'TradeLabs alternative — Trade Desky',
      description: `TradeLabs uses a companion app and your OpenAI key from $49/mo. Trade Desky is ${PRO_PRICE_LABEL}/mo with included AI parsing and Tradier or Schwab execution.`,
      path: '/compare/tradelabs',
    }),
  component: CompareTradelabsPage,
})

function CompareTradelabsPage() {
  return (
    <SeoPage
      title="TradeLabs vs Trade Desky"
      lede="Both use a desktop companion instead of asking you to paste a Discord webhook. The bill and the AI key are the practical differences."
      jsonLd={breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Compare', path: '/compare' },
        { name: 'TradeLabs', path: '/compare/tradelabs' },
      ])}
    >
      <SeoSection title="Price and AI">
        <p className="text-sm">
          TradeLabs public plans (August 2026) start at $49/mo and $149/mo, and their Discord
          automation guide tells you to supply an OpenAI API key. Trade Desky Pro is{' '}
          {PRO_PRICE_LABEL}/mo; alert parsing runs through our configured gateway. You do not paste
          an OpenAI key into our settings.
        </p>
      </SeoSection>
      <SeoSection title="Brokers">
        <p className="text-sm">
          TradeLabs marketing lists Interactive Brokers, Robinhood, Tradier, and Schwab among
          others. We execute on Tradier and Schwab only. If you need IBKR, look elsewhere or wait.
        </p>
      </SeoSection>
      <SeoSection title="Overlap">
        <p className="text-sm">
          Machine must be on. Signals are not stored as a full Discord firehose. For a walkthrough
          of our watcher, see{' '}
          <Link className="underline" to="/integrations/discord">
            Discord alert capture
          </Link>
          .
        </p>
      </SeoSection>
      <RelatedPages
        links={[
          { to: '/compare/nyria', label: 'Nyria comparison' },
          { to: '/pricing', label: 'Trade Desky pricing' },
        ]}
      />
    </SeoPage>
  )
}
