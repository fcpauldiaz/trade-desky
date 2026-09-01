import { createFileRoute, Link } from '@tanstack/react-router'

import SeoPage, { RelatedPages, SeoSection } from '#/components/marketing/SeoPage'
import { NINJATRADER_BRIDGE_DOCS_URL } from '#/lib/brokers'
import { breadcrumbJsonLd, faqPageJsonLd } from '#/lib/json-ld'
import { pageHead } from '#/lib/seo'

const FAQ = [
  {
    q: 'Does NinjaTrader use OAuth in Trade Desky?',
    a: 'No. You run the trade-desky-ninjatrader bridge on your machine and paste its webhook URL into Connections. Account selection happens inside NinjaTrader.',
  },
  {
    q: 'Can I route futures alerts to NinjaTrader?',
    a: 'Yes. When NinjaTrader is connected and set as default, parsed futures intents from desktop alerts or your inbound JSON webhook can forward to your local bridge.',
  },
  {
    q: 'What is the inbound webhook for?',
    a: 'TradingView, Discord bots, or custom systems can POST JSON to your Trade Desky webhook URL. We parse with AI and route futures to NinjaTrader when it is your execution target.',
  },
] as const

export const Route = createFileRoute('/integrations/ninjatrader')({
  head: () =>
    pageHead({
      title: 'NinjaTrader futures automation',
      description:
        'Connect NinjaTrader with a local bridge URL. Route parsed futures alerts from desktop capture or a custom JSON webhook — no OAuth.',
      path: '/integrations/ninjatrader',
    }),
  component: NinjaTraderIntegrationPage,
})

function NinjaTraderIntegrationPage() {
  return (
    <SeoPage
      title="Route futures alerts to NinjaTrader"
      lede="NinjaTrader is the futures execution path. Install the local bridge, paste its webhook URL on Connections, and optionally enable a cloud inbound webhook for TradingView or custom bots."
      jsonLd={[
        breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Integrations', path: '/integrations' },
          { name: 'NinjaTrader', path: '/integrations/ninjatrader' },
        ]),
        faqPageJsonLd(FAQ),
      ]}
    >
      <SeoSection title="Local bridge, not OAuth">
        <p className="text-sm">
          NinjaTrader does not offer a cloud OAuth flow like Schwab. Trade Desky stores your{' '}
          <code className="text-xs">forward_url</code> — the public URL of your{' '}
          <code className="text-xs">trade-desky-ninjatrader</code> receiver (for example a
          Cloudflare tunnel). The receiver requires HTTPS. Orders ping that URL when futures are the
          target. Optionally pass your bridge webhook secret and an account label for display in
          Connections.
        </p>
      </SeoSection>
      <SeoSection title="Connect NinjaTrader">
        <ol className="list-decimal space-y-2 pl-5 text-sm">
          <li>
            Subscribe on <Link to="/pricing">pricing</Link> so Connections can save a broker.
          </li>
          <li>
            Install the{' '}
            <a className="underline" href={NINJATRADER_BRIDGE_DOCS_URL} rel="noreferrer" target="_blank">
              trade-desky-ninjatrader bridge
            </a>{' '}
            and start it with your NinjaTrader account linked in the NT panel.
          </li>
          <li>
            Open <Link to="/connections">Connections</Link>, paste the bridge{' '}
            <code className="text-xs">forward_url</code>, and save.
          </li>
          <li>
            Optional: create an inbound JSON webhook on Connections for TradingView, Discord bots, or
            custom alert systems.
          </li>
        </ol>
      </SeoSection>
      <SeoSection title="Inbound JSON webhook">
        <p className="text-sm">
          Separate from the NT bridge URL: Trade Desky can issue a cloud webhook URL + secret.
          External systems POST JSON with the <code className="text-xs">X-Webhook-Secret</code>{' '}
          header. Parsed futures route to NinjaTrader when it is connected and set as default.
          Options still go to Tradier or Schwab when those are connected.
        </p>
      </SeoSection>
      <details className="feature-item">
        <summary className="font-black">NinjaTrader FAQ</summary>
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
          { to: '/integrations/schwab', label: 'Schwab OAuth' },
          { to: '/integrations/discord', label: 'Desktop alert capture' },
        ]}
      />
    </SeoPage>
  )
}
