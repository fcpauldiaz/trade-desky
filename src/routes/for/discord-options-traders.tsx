import { createFileRoute, Link } from '@tanstack/react-router'

import SeoPage, { RelatedPages, SeoSection } from '#/components/marketing/SeoPage'
import { breadcrumbJsonLd } from '#/lib/json-ld'
import { pageHead } from '#/lib/seo'
import { PRO_PRICE_LABEL } from '#/lib/site'

export const Route = createFileRoute('/for/discord-options-traders')({
  head: () =>
    pageHead({
      title: 'Discord options trading automation for alert followers',
      description: `If you follow Discord option calls and trade them at Tradier or Schwab, Trade Desky captures the desktop alert and places the order. ${PRO_PRICE_LABEL}/mo.`,
      path: '/for/discord-options-traders',
    }),
  component: PersonaPage,
})

function PersonaPage() {
  return (
    <SeoPage
      title="For traders who follow Discord option alerts"
      lede="This page is for subscribers of someone else’s calls, not for people selling a signal community. You already have Discord and a broker. You are tired of retyping the chain."
      jsonLd={breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Discord options traders', path: '/for/discord-options-traders' },
      ])}
    >
      <SeoSection title="Who this is for">
        <ul className="list-disc space-y-2 pl-5 text-sm">
          <li>You sit on a desktop with Discord notification banners enabled.</li>
          <li>You trade US options at Tradier or Schwab, paper or live.</li>
          <li>You want a cap on contracts and a ticker allow-list, not a second career hosting bots.</li>
        </ul>
      </SeoSection>
      <SeoSection title="Who this is not for">
        <p className="text-sm">
          Signal sellers who need to bill their own subscribers, people who only trade from a phone,
          or anyone who needs IBKR/Webull today. We are not a broker and not an adviser.
        </p>
      </SeoSection>
      <SeoSection title="Path">
        <p className="text-sm">
          <Link className="underline" to="/signup">
            Sign up
          </Link>
          , subscribe on{' '}
          <Link className="underline" to="/pricing">
            pricing
          </Link>
          , connect a broker, install the desktop app. Support:{' '}
          <Link className="underline" to="/support">
            support
          </Link>
          .
        </p>
      </SeoSection>
      <RelatedPages
        links={[
          { to: '/integrations/discord', label: 'How Discord alerts are captured' },
          { to: '/compare/manual-copy', label: 'Vs typing the chain yourself' },
          { to: '/reviews', label: 'Customer reviews' },
        ]}
      />
    </SeoPage>
  )
}
