import { createFileRoute, Link } from '@tanstack/react-router'

import SeoPage, { RelatedPages, SeoSection } from '#/components/marketing/SeoPage'
import { breadcrumbJsonLd } from '#/lib/json-ld'
import { pageHead } from '#/lib/seo'
import { PRO_PRICE_LABEL } from '#/lib/site'

export const Route = createFileRoute('/compare/botifytrades')({
  head: () =>
    pageHead({
      title: 'BotifyTrades alternative — Trade Desky',
      description: `BotifyTrades is a self-hosted multi-broker Discord bot. Trade Desky is hosted SaaS at ${PRO_PRICE_LABEL}/mo for Tradier and Schwab with a desktop notification watcher.`,
      path: '/compare/botifytrades',
    }),
  component: CompareBotifyPage,
})

function CompareBotifyPage() {
  return (
    <SeoPage
      title="BotifyTrades vs Trade Desky"
      lede="BotifyTrades is an open, self-hosted stack with many brokers and risk engines. Trade Desky is a hosted product: you pay a subscription and we run parsing and broker OAuth for two brokers."
      jsonLd={breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Compare', path: '/compare' },
        { name: 'BotifyTrades', path: '/compare/botifytrades' },
      ])}
    >
      <SeoSection title="Ops burden">
        <p className="text-sm">
          If you want to run Python on your own machine, tune 100+ parsers, and fan out to Webull,
          IBKR, and Tastytrade at once, BotifyTrades is aimed at that. Trade Desky is for traders
          who want sign-in, a desktop watcher, and Tradier or Schwab without hosting the bot.
        </p>
      </SeoSection>
      <SeoSection title="Cost">
        <p className="text-sm">
          BotifyTrades itself is not a {PRO_PRICE_LABEL}/mo SaaS bill; you pay infrastructure and
          time. Trade Desky is {PRO_PRICE_LABEL}/mo via Creem. See{' '}
          <Link className="underline" to="/pricing">
            pricing
          </Link>
          .
        </p>
      </SeoSection>
      <RelatedPages
        links={[
          { to: '/compare/manual-copy', label: 'Vs manual copy' },
          { to: '/integrations', label: 'What we actually connect' },
        ]}
      />
    </SeoPage>
  )
}
