import { createFileRoute, Link } from '@tanstack/react-router'

import { pageHead } from '#/lib/seo'
import { DESKTOP_APP_NAME } from '#/lib/desktop-app'
import { SUPPORT_EMAIL } from '#/lib/site'

export const Route = createFileRoute('/support')({
  head: () =>
    pageHead({
      title: 'Trade Desky support',
      description: `Help with the desktop app, Tradier and Schwab connections, and billing. Email ${SUPPORT_EMAIL}.`,
      path: '/support',
    }),
  component: SupportPage,
})

function SupportPage() {
  return (
    <main className="marketing-page page-wrap px-4 py-10">
      <header className="marketing-page-header">
        <h1>Support</h1>
        <p>Help with the desktop app, broker connections, and billing.</p>
      </header>
      <div className="feature-item space-y-3 text-sm text-[var(--muted-foreground)]">
        <p>
          Email{' '}
          <a className="font-semibold text-[var(--ja-black)] underline" href={`mailto:${SUPPORT_EMAIL}`}>
            {SUPPORT_EMAIL}
          </a>
          . We aim to reply within three business days.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Desktop app — install {DESKTOP_APP_NAME} from the{' '}
            <Link to="/download" className="underline">
              download page
            </Link>{' '}
            and sign in with your platform account
          </li>
          <li>
            <Link to="/connections">Broker connections</Link> — Tradier API token or OAuth, Schwab OAuth
          </li>
          <li>
            <Link to="/billing">Billing</Link> — view subscription status or request Pro access
          </li>
          <li>
            <Link to="/refund">Refunds</Link> — how cancellations and refund requests work
          </li>
          <li>
            <Link to="/terms">Terms</Link>, <Link to="/privacy">Privacy</Link>, and{' '}
            <Link to="/risk">Risk disclosure</Link>
          </li>
        </ul>
      </div>
    </main>
  )
}
