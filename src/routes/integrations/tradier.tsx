import { createFileRoute, Link } from '@tanstack/react-router'

import SeoPage, { RelatedPages, SeoSection } from '#/components/marketing/SeoPage'
import { breadcrumbJsonLd, faqPageJsonLd } from '#/lib/json-ld'
import { pageHead } from '#/lib/seo'

const FAQ = [
  {
    q: 'Does Trade Desky use a Tradier partner OAuth app?',
    a: 'OAuth is optional and only works if the receiver has TRADIER_CLIENT_ID and SECRET. Most users paste a personal API token from Tradier API settings.',
  },
  {
    q: 'How do I paper trade on Tradier?',
    a: 'On Connections, choose Paper (sandbox) and paste a sandbox token. Production tokens are for live. Switching environments requires the matching token.',
  },
  {
    q: 'Can I send Discord alerts to Tradier without a webhook?',
    a: 'Yes. Install Trade Desky Watcher, sign in, and keep the app running. Alerts are captured from desktop notifications, then routed to your connected Tradier account.',
  },
] as const

export const Route = createFileRoute('/integrations/tradier')({
  head: () =>
    pageHead({
      title: 'Automate Discord alerts to Tradier',
      description:
        'Paste a Tradier sandbox token for paper or a production token for live. Trade Desky parses desktop notifications and sends option orders — no webhook URL.',
      path: '/integrations/tradier',
    }),
  component: TradierIntegrationPage,
})

function TradierIntegrationPage() {
  return (
    <SeoPage
      title="Send Discord option alerts to Tradier automatically"
      lede="Tradier is the broker to use when you want a paper sandbox in the same product as live. Connection is a token you already have in Tradier’s API settings."
      jsonLd={[
        breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Integrations', path: '/integrations' },
          { name: 'Tradier', path: '/integrations/tradier' },
        ]),
        faqPageJsonLd(FAQ),
      ]}
    >
      <SeoSection title="How this differs from a Discord bot">
        <p className="text-sm">
          We do not join your server. Trade Desky Watcher reads the same banners you see on macOS
          or Windows. If Discord is quiet or the machine is asleep, nothing is sent to Tradier.
        </p>
      </SeoSection>
      <SeoSection title="Connect Tradier">
        <ol className="list-decimal space-y-2 pl-5 text-sm">
          <li>
            Subscribe on <Link to="/pricing">pricing</Link> so Connections can save a broker.
          </li>
          <li>
            Open{' '}
            <a className="underline" href="https://dash.tradier.com/settings/api" rel="noreferrer" target="_blank">
              Tradier API settings
            </a>{' '}
            and copy a sandbox token (paper) or production token (live).
          </li>
          <li>
            In <Link to="/connections">Connections</Link>, pick Paper or Live, paste the token, and
            optionally an account id. Leave account id blank to use the profile default.
          </li>
          <li>Run a test order from Connections, then finish onboarding sizing rules.</li>
        </ol>
      </SeoSection>
      <SeoSection title="What we send">
        <p className="text-sm">
          Parsed option intents after chain validation: underlying, call/put, strike, expiry,
          quantity from your sizing settings. We do not invent multi-leg spreads beyond what the
          parser and validator accept. Failed validation is skipped, not guessed.
        </p>
      </SeoSection>
      <details className="feature-item">
        <summary className="font-black">Tradier FAQ</summary>
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
          { to: '/integrations/schwab', label: 'Schwab OAuth' },
          { to: '/integrations/discord', label: 'Desktop alert capture' },
          { to: '/compare/nyria', label: 'Nyria vs Trade Desky' },
        ]}
      />
    </SeoPage>
  )
}
