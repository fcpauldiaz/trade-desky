import { createFileRoute, Link } from '@tanstack/react-router'

import GuideFigure from '#/components/marketing/GuideFigure'
import SeoPage, { RelatedPages, SeoSection } from '#/components/marketing/SeoPage'
import { NINJATRADER_GUIDE_IMAGES, NINJATRADER_GUIDE_PATH } from '#/lib/guides'
import {
  NINJATRADER_BRIDGE_DOWNLOAD_PATH,
  NINJATRADER_BRIDGE_NAME,
  NINJATRADER_BRIDGE_ZIP_URL,
} from '#/lib/ninjatrader-bridge'
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
  {
    q: 'When do I need a cloud tunnel?',
    a: 'Only when hosted trade-receiver must reach your local Windows receiver over the internet. Same-machine local testing can POST to 127.0.0.1 without a tunnel; production forward URLs still need HTTPS.',
  },
] as const

export const Route = createFileRoute('/integrations/ninjatrader')({
  head: () =>
    pageHead({
      title: 'NinjaTrader futures automation',
      description:
        'Connect NinjaTrader with a local bridge URL. Route parsed futures alerts from desktop capture or a custom JSON webhook — no OAuth. Start on Sim101.',
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
      <img
        src="/brokers/ninjatrader.png"
        alt="NinjaTrader"
        className="guide-brand-mark"
        width={800}
        height={101}
        loading="eager"
        decoding="async"
      />

      <SeoSection title="Local bridge, not OAuth">
        <p className="text-sm">
          NinjaTrader does not offer a cloud OAuth flow like Schwab. Trade Desky stores your{' '}
          <code className="text-xs">forward_url</code> — the public URL of your{' '}
          <code className="text-xs">trade-desky-ninjatrader</code> receiver (for example a
          Cloudflare tunnel). The receiver requires HTTPS when cloud-hosted trade-receiver must reach
          your PC. Orders ping that URL when futures are the target.
        </p>
        <GuideFigure
          src={NINJATRADER_GUIDE_IMAGES.architecture}
          alt="Diagram: desktop watcher or inbound webhook to trade-receiver, tunnel, local Python receiver, NinjaTrader 8"
          caption="Alerts enter Trade Desky cloud, then forward to your local bridge and NinjaTrader 8."
        />
      </SeoSection>

      <SeoSection title="Quick setup (Sim101 first)">
        <ol className="guide-step-list">
          <li className="feature-item space-y-3 p-5">
            <h3 className="text-lg font-black">Download the bridge</h3>
            <p className="text-sm">
              Get {NINJATRADER_BRIDGE_NAME} from the{' '}
              <Link className="underline" to={`${NINJATRADER_BRIDGE_DOWNLOAD_PATH}#ninjatrader`}>
                download page
              </Link>{' '}
              or{' '}
              <a className="underline" href={NINJATRADER_BRIDGE_ZIP_URL} rel="noreferrer" target="_blank">
                bridge ZIP
              </a>
              . Copy add-ons into{' '}
              <code className="text-xs">Documents\NinjaTrader 8\bin\Custom\AddOns\</code>, compile, and
              open the Trade Desky panel. Select <strong>Sim101</strong> and click{' '}
              <strong>Start Listener</strong>.
            </p>
            <GuideFigure
              src={NINJATRADER_GUIDE_IMAGES.ntAddon}
              alt="NinjaTrader Add-On panel mock showing Sim101 selected, Start Listener, and live trading off"
              caption="Start on Sim101 with live trading unchecked until tests pass."
            />
          </li>
          <li className="feature-item space-y-3 p-5">
            <h3 className="text-lg font-black">Run the Python receiver</h3>
            <p className="text-sm">
              In the bridge repo: <code className="text-xs">pip install -r requirements.txt</code>,{' '}
              <code className="text-xs">python main.py --setup</code>, then{' '}
              <code className="text-xs">python main.py</code>. Note the local webhook URL and secret.
              Keep <code className="text-xs">dry_run: true</code> until Sim101 fills look correct.
            </p>
            <GuideFigure
              src={NINJATRADER_GUIDE_IMAGES.receiver}
              alt="Terminal mock showing python main.py setup, listener URL, and dry_run reminder"
              caption="Receiver prints the URL and secret for Trade Desky Connections."
            />
          </li>
          <li className="feature-item space-y-3 p-5">
            <h3 className="text-lg font-black">Expose HTTPS when cloud must reach your PC</h3>
            <p className="text-sm">
              Use Cloudflare Tunnel or ngrok when trade-receiver runs remotely and must POST to your
              Windows machine. Same-machine local dev can target{' '}
              <code className="text-xs">http://127.0.0.1:8787/webhook</code> without a tunnel.
            </p>
            <GuideFigure
              src={NINJATRADER_GUIDE_IMAGES.tunnel}
              alt="Diagram showing Trade Desky cloud connecting through a tunnel to local receiver"
              caption="Tunnel required for remote cloud → local PC; optional for all-local testing."
            />
          </li>
          <li className="feature-item space-y-3 p-5">
            <h3 className="text-lg font-black">Connect on Trade Desky</h3>
            <p className="text-sm">
              Subscribe on <Link to="/pricing">Pricing</Link>, open{' '}
              <Link to="/connections">Connections</Link>, paste your HTTPS forward URL, optionally add
              the bridge secret and account label, then run <strong>Test</strong>.
            </p>
            <GuideFigure
              src={NINJATRADER_GUIDE_IMAGES.connections}
              alt="Mock of Trade Desky Connections page with NinjaTrader forward URL and inbound webhook secret"
              caption="Forward URL is the bridge endpoint; inbound webhook is separate for TradingView or bots."
            />
          </li>
        </ol>
        <p className="text-sm">
          Full walkthrough with go-live checklist:{' '}
          <Link className="font-semibold underline" to={NINJATRADER_GUIDE_PATH}>
            NinjaTrader setup guide
          </Link>
          .
        </p>
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
          { to: NINJATRADER_GUIDE_PATH, label: 'NinjaTrader setup guide' },
          { to: `${NINJATRADER_BRIDGE_DOWNLOAD_PATH}#ninjatrader`, label: 'Download bridge ZIP' },
          { to: '/integrations/tradier', label: 'Tradier paper + live' },
          { to: '/integrations/schwab', label: 'Schwab OAuth' },
          { to: '/integrations/discord', label: 'Desktop alert capture' },
        ]}
      />
    </SeoPage>
  )
}
