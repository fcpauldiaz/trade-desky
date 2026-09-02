import { createFileRoute, Link } from '@tanstack/react-router'

import SeoPage, { RelatedPages } from '#/components/marketing/SeoPage'
import {
  DESKTOP_APP_NAME,
  DESKTOP_MAC_ASSET_PATH,
  DESKTOP_WIN_ASSET_PATH,
} from '#/lib/desktop-app'
import { breadcrumbJsonLd } from '#/lib/json-ld'
import {
  NINJATRADER_BRIDGE_GUIDE_PATH,
  NINJATRADER_BRIDGE_NAME,
  NINJATRADER_BRIDGE_WIN_ASSET_PATH,
  NINJATRADER_BRIDGE_ZIP_PATH,
} from '#/lib/ninjatrader-bridge'
import { pageHead } from '#/lib/seo'

export const Route = createFileRoute('/download')({
  head: () =>
    pageHead({
      title: 'Download Trade Desky Watcher & NinjaTrader bridge',
      description:
        'Download Trade Desky Watcher for macOS and Windows, or the NinjaTrader 8 bridge installer for futures execution on Windows. Sign in with your Trade Desky account.',
      path: '/download',
    }),
  component: DownloadPage,
})

function DownloadPage() {
  return (
    <SeoPage
      title="Download Trade Desky"
      lede="Trade Desky Watcher captures desktop alerts on macOS and Windows. The NinjaTrader bridge runs on Windows with NT8 for futures routing."
      jsonLd={breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Download', path: '/download' },
      ])}
    >
      <div className="download-product-grid">
        <article className="download-product-card">
          <div className="download-product-card-top">
            <span className="section-badge section-badge-yellow">Desktop</span>
            <p className="download-product-platforms">macOS · Windows</p>
          </div>
          <h2>{DESKTOP_APP_NAME}</h2>
          <p>
            Install, grant notification access, then sign in with the same Trade Desky account you use
            in the browser. No GitHub or webhook URL required.
          </p>
          <div className="download-product-actions">
            <a className="btn-primary" href={DESKTOP_MAC_ASSET_PATH}>
              Download for macOS
            </a>
            <a className="btn-secondary" href={DESKTOP_WIN_ASSET_PATH}>
              Download for Windows
            </a>
          </div>
          <p className="download-product-note">
            macOS: open the DMG and drag the app to Applications, then grant Full Disk Access.
            Windows: run the setup installer (per-user, no admin). Bundled apps update from this site.
          </p>
          <Link className="download-product-link" to="/integrations/discord">
            Discord alert setup →
          </Link>
        </article>

        <article className="download-product-card" id="ninjatrader">
          <div className="download-product-card-top">
            <span className="section-badge section-badge-yellow">Futures</span>
            <p className="download-product-platforms">Windows · NT8</p>
          </div>
          <div className="download-product-logo-wrap">
            <img
              src="/brokers/ninjatrader.png"
              alt="NinjaTrader"
              className="download-product-logo"
              width={800}
              height={101}
              loading="lazy"
              decoding="async"
            />
          </div>
          <h2>{NINJATRADER_BRIDGE_NAME}</h2>
          <p>
            Local Windows adapter: NT8 add-on plus Python webhook receiver. Route parsed futures from
            Trade Desky cloud to your NinjaTrader workstation.
          </p>
          <div className="download-product-actions">
            <a className="btn-primary" href={NINJATRADER_BRIDGE_WIN_ASSET_PATH}>
              Download for Windows
            </a>
            <a className="btn-secondary" href={NINJATRADER_BRIDGE_ZIP_PATH}>
              Portable ZIP
            </a>
          </div>
          <p className="download-product-note">
            Windows: run the setup installer (per-user). Or unzip the portable ZIP and copy add-on
            files into{' '}
            <code className="text-xs">Documents\NinjaTrader 8\bin\Custom\AddOns\</code>, then compile
            in NinjaTrader. Start on Sim101 before enabling live trading.
          </p>
          <Link className="download-product-link" to={NINJATRADER_BRIDGE_GUIDE_PATH}>
            Full setup guide →
          </Link>
        </article>
      </div>

      <RelatedPages
        links={[
          { to: '/integrations/ninjatrader', label: 'NinjaTrader integration' },
          { to: '/integrations/discord', label: 'Discord alerts' },
          { to: '/support', label: 'Support' },
          { to: '/pricing', label: 'Pricing' },
        ]}
      />
    </SeoPage>
  )
}
