import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/privacy')({ component: PrivacyPage })

function PrivacyPage() {
  return (
    <main className="page-wrap max-w-2xl px-4 py-10 prose prose-sm">
      <h1>Privacy Policy</h1>
      <p>We store your email, API key hash, broker OAuth tokens (encrypted), trade history, and subscription status.</p>
      <p>Broker tokens are encrypted at rest. We do not sell your data.</p>
      <p>Notification Watcher runs on your device; when signed in, alert text is sent to the Trade Desky ingest endpoint.</p>
    </main>
  )
}
