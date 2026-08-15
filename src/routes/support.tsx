import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/support')({ component: SupportPage })

function SupportPage() {
  return (
    <main className="marketing-page page-wrap px-4 py-10">
      <header className="marketing-page-header">
        <h1>Support</h1>
        <p>Help with the desktop app, broker connections, and billing.</p>
      </header>
      <div className="feature-item space-y-3 text-sm text-[var(--muted-foreground)]">
        <p>Email support@tradedesky.example or open an issue on GitHub for bugs and feature requests.</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Desktop app — install Notification Watcher and sign in with your platform account</li>
          <li>
            <Link to="/connections">Broker connections</Link> — Tradier and Schwab OAuth
          </li>
          <li>
            <Link to="/billing">Billing</Link> — subscription and renewals
          </li>
        </ul>
      </div>
    </main>
  )
}
