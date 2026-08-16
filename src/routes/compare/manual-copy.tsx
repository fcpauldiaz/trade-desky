import { createFileRoute, Link } from '@tanstack/react-router'

import SeoPage, { RelatedPages, SeoSection } from '#/components/marketing/SeoPage'
import { breadcrumbJsonLd } from '#/lib/json-ld'
import { pageHead } from '#/lib/seo'

export const Route = createFileRoute('/compare/manual-copy')({
  head: () =>
    pageHead({
      title: 'Copy Discord alerts to your broker automatically',
      description:
        'Manual copy-paste loses time on every options alert. Trade Desky captures the desktop notification, parses the contract, and sends Tradier or Schwab orders.',
      path: '/compare/manual-copy',
    }),
  component: CompareManualPage,
})

function CompareManualPage() {
  return (
    <SeoPage
      title="Stop copy-pasting Discord alerts into the broker"
      lede="The failure mode is boring and expensive: the call is good, you were reading chat, the option already moved. Automation does not fix a bad call. It removes the typing delay."
      jsonLd={breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Compare', path: '/compare' },
        { name: 'Manual copy', path: '/compare/manual-copy' },
      ])}
    >
      <SeoSection title="What you do today">
        <ol className="list-decimal space-y-2 pl-5 text-sm">
          <li>Notification or ping lands.</li>
          <li>Switch to the broker, find the chain, pick strike and expiry.</li>
          <li>Size the order, submit, hope the quote is still there.</li>
        </ol>
      </SeoSection>
      <SeoSection title="What Trade Desky does">
        <ol className="list-decimal space-y-2 pl-5 text-sm">
          <li>Notification Watcher captures the banner on the desktop.</li>
          <li>AI parses action, ticker, strike, expiry.</li>
          <li>Chain validation runs; the connected broker places the order if it passes.</li>
        </ol>
        <p className="text-sm">
          You still set max contracts, allowed tickers, and paper vs live. Details:{' '}
          <Link className="underline" to="/integrations/discord">
            alert capture
          </Link>
          .
        </p>
      </SeoSection>
      <RelatedPages
        links={[
          { to: '/pricing', label: 'See pricing' },
          { to: '/for/discord-options-traders', label: 'Built for alert followers' },
        ]}
      />
    </SeoPage>
  )
}
