import { createFileRoute, Link } from '@tanstack/react-router'

import SeoPage, { RelatedPages, SeoSection } from '#/components/marketing/SeoPage'
import { DESKTOP_APP_NAME, DESKTOP_APP_RELEASES_URL } from '#/lib/desktop-app'
import { breadcrumbJsonLd, faqPageJsonLd } from '#/lib/json-ld'
import { pageHead } from '#/lib/seo'

const FAQ = [
  {
    q: 'Do I invite a Discord bot?',
    a: 'No. Trade Desky does not join servers. The desktop app captures operating-system notification banners, including Discord’s, after you grant notification permission.',
  },
  {
    q: 'Why no webhook URL?',
    a: 'Ingest is tied to your signed-in device token. You do not paste a per-user webhook into a Discord channel or Zapier.',
  },
  {
    q: 'What if Discord is on my phone only?',
    a: 'The watcher runs on macOS or Windows. Phone-only notifications never reach the ingest API.',
  },
] as const

export const Route = createFileRoute('/integrations/discord')({
  head: () =>
    pageHead({
      title: 'Discord options alert copier — desktop capture',
      description:
        'Trade Desky copies Discord-style option alerts from macOS and Windows notifications. No bot invite, no webhook URL, then Tradier or Schwab execution.',
      path: '/integrations/discord',
    }),
  component: DiscordIntegrationPage,
})

function DiscordIntegrationPage() {
  return (
    <SeoPage
      title="Copy Discord option alerts without a webhook"
      lede="If you already get trade calls as desktop banners, Trade Desky is built to grab those banners, parse strike and expiry, and hand the intent to your broker."
      jsonLd={[
        breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Integrations', path: '/integrations' },
          { name: 'Discord alerts', path: '/integrations/discord' },
        ]),
        faqPageJsonLd(FAQ),
      ]}
    >
      <SeoSection title={`${DESKTOP_APP_NAME}, not a server bot`}>
        <p className="text-sm">
          Products that invite a Discord bot see every channel message in a guild. We only see what
          the OS shows you. That is slower to set up on a new machine and stricter about “computer
          must be awake,” and it avoids storing a bot token in a foreign server.
        </p>
      </SeoSection>
      <SeoSection title="Setup">
        <ol className="list-decimal space-y-2 pl-5 text-sm">
          <li>
            Create an account and subscribe on <Link to="/pricing">pricing</Link>.
          </li>
          <li>
            Install {DESKTOP_APP_NAME} from the{' '}
            <a className="underline" href={DESKTOP_APP_RELEASES_URL} rel="noreferrer" target="_blank">
              desktop releases
            </a>{' '}
            and sign in with the same email.
          </li>
          <li>Allow notification access when the OS asks.</li>
          <li>
            Connect <Link to="/integrations/tradier">Tradier</Link> or{' '}
            <Link to="/integrations/schwab">Schwab</Link>.
          </li>
        </ol>
      </SeoSection>
      <SeoSection title="What gets parsed">
        <p className="text-sm">
          Discord-style option text (ticker, BTO/STC-style actions, strike, expiry). Garbage in still
          fails validation. We do not scrape Discord message history in the cloud.
        </p>
      </SeoSection>
      <details className="feature-item">
        <summary className="font-black">Alert capture FAQ</summary>
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
          { to: '/for/discord-options-traders', label: 'For Discord options traders' },
          { to: '/compare/manual-copy', label: 'Vs copying into the broker' },
          { to: '/integrations', label: 'All integrations' },
        ]}
      />
    </SeoPage>
  )
}
