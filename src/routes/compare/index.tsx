import { createFileRoute, Link } from '@tanstack/react-router'

import SeoPage, { RelatedPages, SeoSection } from '#/components/marketing/SeoPage'
import { breadcrumbJsonLd } from '#/lib/json-ld'
import { pageHead } from '#/lib/seo'
import { PRO_PRICE_LABEL } from '#/lib/site'

export const Route = createFileRoute('/compare/')({
  head: () =>
    pageHead({
      title: 'Trade Desky vs Nyria, TradeLabs, and manual copy',
      description: `Flat ${PRO_PRICE_LABEL}/mo, desktop notification capture, Tradier and Schwab. Compare Trade Desky with Nyria, TradeLabs, BotifyTrades, and copy-paste.`,
      path: '/compare',
    }),
  component: CompareIndexPage,
})

function CompareIndexPage() {
  return (
    <SeoPage
      title="Compare Trade Desky"
      lede="These pages describe Trade Desky as it ships today against public competitor pages as of August 2026. Feature lists change — verify before you pay anyone."
      jsonLd={breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Compare', path: '/compare' },
      ])}
    >
      <SeoSection title="Start here">
        <ul className="list-disc space-y-2 pl-5 text-sm">
          <li>
            <Link className="font-semibold underline" to="/compare/nyria">
              Nyria
            </Link>{' '}
            — allocation pricing and a Discord bot vs our desktop watcher and {PRO_PRICE_LABEL}/mo.
          </li>
          <li>
            <Link className="font-semibold underline" to="/compare/tradelabs">
              TradeLabs
            </Link>{' '}
            — another companion-app copier; they ask for your OpenAI key.
          </li>
          <li>
            <Link className="font-semibold underline" to="/compare/botifytrades">
              BotifyTrades
            </Link>{' '}
            — self-hosted multi-broker bot vs hosted SaaS.
          </li>
          <li>
            <Link className="font-semibold underline" to="/compare/manual-copy">
              Manual copy-paste
            </Link>{' '}
            — the default workflow we replace.
          </li>
        </ul>
      </SeoSection>
      <RelatedPages
        links={[
          { to: '/pricing', label: 'Pricing' },
          { to: '/integrations', label: 'Integrations' },
        ]}
      />
    </SeoPage>
  )
}
