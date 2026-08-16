import { createFileRoute } from '@tanstack/react-router'

import SeoPage, { RelatedPages, SeoSection } from '#/components/marketing/SeoPage'
import {
  DESKTOP_APP_NAME,
  DESKTOP_MAC_ASSET_PATH,
  DESKTOP_WIN_ASSET_PATH,
} from '#/lib/desktop-app'
import { breadcrumbJsonLd } from '#/lib/json-ld'
import { pageHead } from '#/lib/seo'

export const Route = createFileRoute('/download')({
  head: () =>
    pageHead({
      title: `Download ${DESKTOP_APP_NAME}`,
      description:
        'Download Trade Desky Watcher for macOS or Windows. Sign in with your Trade Desky account — no GitHub or webhook URL required.',
      path: '/download',
    }),
  component: DownloadPage,
})

function DownloadPage() {
  return (
    <SeoPage
      title={`Download ${DESKTOP_APP_NAME}`}
      lede="macOS and Windows builds. Install, grant notification access, then sign in with the same account you use here."
      jsonLd={breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Download', path: '/download' },
      ])}
    >
      <SeoSection title="Installers">
        <div className="flex flex-wrap gap-3">
          <a className="btn-primary" href={DESKTOP_MAC_ASSET_PATH}>
            Download for macOS
          </a>
          <a className="btn-secondary" href={DESKTOP_WIN_ASSET_PATH}>
            Download for Windows
          </a>
        </div>
        <p className="text-sm">
          macOS: open the DMG and drag the app to Applications, then grant Full Disk Access.
          Windows: run the setup installer (per-user, no admin). Bundled apps update themselves
          from this site.
        </p>
      </SeoSection>
      <RelatedPages
        links={[
          { to: '/support', label: 'Support' },
          { to: '/integrations/discord', label: 'Discord alerts' },
          { to: '/pricing', label: 'Pricing' },
        ]}
      />
    </SeoPage>
  )
}
