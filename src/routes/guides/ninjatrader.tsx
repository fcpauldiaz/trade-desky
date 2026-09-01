import { createFileRoute, Link } from '@tanstack/react-router'

import GuideFigure from '#/components/marketing/GuideFigure'
import SeoPage, { RelatedPages, SeoSection } from '#/components/marketing/SeoPage'
import {
  NINJATRADER_BRIDGE_DOWNLOAD_PATH,
  NINJATRADER_BRIDGE_ZIP_URL,
} from '#/lib/ninjatrader-bridge'
import {
  NINJATRADER_GUIDE_IMAGES,
  NINJATRADER_GUIDE_PATH,
} from '#/lib/guides'
import { breadcrumbJsonLd } from '#/lib/json-ld'
import { pageHead } from '#/lib/seo'

export const Route = createFileRoute('/guides/ninjatrader')({
  head: () =>
    pageHead({
      title: 'NinjaTrader setup guide — Sim101 to live',
      description:
        'Step-by-step: install the trade-desky-ninjatrader bridge, run the Python receiver, expose HTTPS, connect on Trade Desky, and optional inbound webhooks. Start on Sim101.',
      path: NINJATRADER_GUIDE_PATH,
    }),
  component: NinjaTraderGuidePage,
})

function NinjaTraderGuidePage() {
  return (
    <SeoPage
      title="Connect NinjaTrader to Trade Desky"
      lede="This guide walks through Sim101 paper first: local bridge, Python receiver, HTTPS forward URL on Connections, test order, then optional inbound webhooks and going live."
      jsonLd={breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Guides', path: NINJATRADER_GUIDE_PATH },
        { name: 'NinjaTrader', path: NINJATRADER_GUIDE_PATH },
      ])}
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

      <SeoSection title="Architecture overview">
        <p className="text-sm">
          Alerts enter Trade Desky from the desktop watcher or your inbound JSON webhook. The cloud
          parses intent and forwards futures orders to your local bridge, which hands them to
          NinjaTrader 8.
        </p>
        <GuideFigure
          src={NINJATRADER_GUIDE_IMAGES.architecture}
          alt="Diagram: desktop watcher or inbound webhook to trade-receiver, tunnel, local Python receiver, NinjaTrader 8"
          caption="End-to-end path from alert capture to NinjaTrader. Use a tunnel when Trade Desky cloud must reach your machine."
        />
      </SeoSection>

      <ol className="guide-step-list">
        <li className="feature-item space-y-3 p-5">
          <h3 className="text-lg font-black">Install the local bridge (Sim101 first)</h3>
          <p className="text-sm">
            Download the bridge from the{' '}
            <Link className="underline" to={`${NINJATRADER_BRIDGE_DOWNLOAD_PATH}#ninjatrader`}>
              download page
            </Link>{' '}
            or use the{' '}
            <a className="underline" href={NINJATRADER_BRIDGE_ZIP_URL} rel="noreferrer" target="_blank">
              bridge ZIP
            </a>
            . Copy <code className="text-xs">NinjaTrader/*.cs</code> into{' '}
            <code className="text-xs">Documents\NinjaTrader 8\bin\Custom\AddOns\</code>, compile in
            NinjaTrader, then open <strong>Trade Desky — NinjaTrader</strong>.
          </p>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            <li>Select <strong>Sim101</strong> (simulation account).</li>
            <li>Click <strong>Start Listener</strong>.</li>
            <li>Keep <strong>Live trading</strong> unchecked until you finish testing.</li>
          </ul>
          <GuideFigure
            src={NINJATRADER_GUIDE_IMAGES.ntAddon}
            alt="NinjaTrader Add-On panel mock showing Sim101 selected, Start Listener, and live trading off"
            caption="Pick Sim101 and start the listener before connecting Trade Desky cloud."
          />
        </li>

        <li className="feature-item space-y-3 p-5">
          <h3 className="text-lg font-black">Run the Python receiver</h3>
          <p className="text-sm">
            In the bridge repo, create a venv, install dependencies, then run setup and start the
            receiver:
          </p>
          <pre className="overflow-x-auto rounded-lg border-2 border-[var(--ja-black)] bg-[var(--ja-gray-50)] p-3 text-xs">
{`python -m venv .venv
source .venv/bin/activate   # Windows: .venv\\Scripts\\activate
pip install -r requirements.txt
python main.py --setup
python main.py`}
          </pre>
          <p className="text-sm">
            Note the local webhook URL (for example <code className="text-xs">http://127.0.0.1:8787/webhook</code>)
            and secret. Keep <code className="text-xs">dry_run: true</code> in config until Sim101
            test fills look correct.
          </p>
          <GuideFigure
            src={NINJATRADER_GUIDE_IMAGES.receiver}
            alt="Terminal mock showing python main.py setup, listener URL, and dry_run reminder"
            caption="Receiver prints the local URL and secret to paste into Trade Desky Connections."
          />
        </li>

        <li className="feature-item space-y-3 p-5">
          <h3 className="text-lg font-black">Expose the receiver for Trade Desky cloud</h3>
          <p className="text-sm">
            Trade Desky cloud must POST to an <strong>HTTPS</strong> forward URL. You need a tunnel
            when the receiver runs on your PC and trade-receiver is hosted remotely.
          </p>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            <li>
              <strong>Tunnel required:</strong> cloud Trade Desky → your home/office PC running NT.
            </li>
            <li>
              <strong>Tunnel optional:</strong> everything on one machine during local dev (still use
              HTTPS in production).
            </li>
          </ul>
          <p className="text-sm">
            Use Cloudflare Tunnel (<code className="text-xs">cloudflared tunnel</code>) or ngrok to
            map a public URL to <code className="text-xs">http://127.0.0.1:8787/webhook</code>.
          </p>
          <GuideFigure
            src={NINJATRADER_GUIDE_IMAGES.tunnel}
            alt="Diagram showing Trade Desky cloud connecting through a tunnel to local receiver"
            caption="Example forward URL: https://your-subdomain.trycloudflare.com/webhook"
          />
        </li>

        <li className="feature-item space-y-3 p-5">
          <h3 className="text-lg font-black">Connect in Trade Desky</h3>
          <p className="text-sm">
            Subscribe on <Link to="/pricing">Pricing</Link>, then open{' '}
            <Link to="/connections">Connections</Link>:
          </p>
          <ol className="list-decimal space-y-1 pl-5 text-sm">
            <li>Paste your HTTPS forward URL.</li>
            <li>Optionally add the bridge webhook secret and an account label.</li>
            <li>Click <strong>Connect NinjaTrader</strong>.</li>
            <li>Set NinjaTrader as <strong>default</strong> if futures should route there.</li>
            <li>Run <strong>Test</strong> — uses a dry-run ES order while in paper mode.</li>
          </ol>
          <GuideFigure
            src={NINJATRADER_GUIDE_IMAGES.connections}
            alt="Mock of Trade Desky Connections page with NinjaTrader forward URL and inbound webhook secret"
            caption="Forward URL is the bridge endpoint; inbound webhook is separate for TradingView or bots."
          />
        </li>

        <li className="feature-item space-y-3 p-5">
          <h3 className="text-lg font-black">Optional: inbound JSON webhook</h3>
          <p className="text-sm">
            On Connections, create an inbound webhook. Copy the URL and secret once (they are not
            shown again). External systems POST JSON with the{' '}
            <code className="text-xs">X-Webhook-Secret</code> header. Trade Desky parses with AI and
            routes futures to NinjaTrader when it is your default broker.
          </p>
          <p className="text-sm">
            Discord-style desktop alerts still use Trade Desky Watcher — no inbound webhook required
            for those.
          </p>
        </li>

        <li className="feature-item space-y-3 p-5">
          <h3 className="text-lg font-black">Go live checklist</h3>
          <ol className="list-decimal space-y-1 pl-5 text-sm">
            <li>Sim101 test fills succeed with <code className="text-xs">dry_run: true</code>.</li>
            <li>Set <code className="text-xs">dry_run: false</code> in the Python receiver config.</li>
            <li>Enable <strong>Live trading</strong> in the NT Add-On only when you accept real risk.</li>
            <li>Confirm account, sizing, and caps in Trade Desky <Link to="/settings">Settings</Link>.</li>
          </ol>
          <div className="guide-callout">
            Futures trading involves substantial risk of loss. Trade Desky is software, not a broker
            or advisor. Read the <Link to="/risk">Risk Disclosure</Link> before enabling live
            execution.
          </div>
        </li>
      </ol>

      <RelatedPages
        links={[
          { to: '/integrations/ninjatrader', label: 'NinjaTrader integration overview' },
          { to: `${NINJATRADER_BRIDGE_DOWNLOAD_PATH}#ninjatrader`, label: 'Download bridge ZIP' },
          { to: '/connections', label: 'Open Connections' },
          { to: '/integrations/discord', label: 'Desktop alert capture' },
        ]}
      />
    </SeoPage>
  )
}
