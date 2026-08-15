import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/terms')({ component: TermsPage })

function TermsPage() {
  return (
    <main className="page-wrap max-w-2xl px-4 py-10 prose prose-sm">
      <h1>Terms of Service</h1>
      <p>Trade Desky provides software that routes trade alerts to connected brokerages. You are responsible for all orders placed in your accounts.</p>
      <p>Subscriptions are billed through Creem. Cancel anytime via your billing portal.</p>
      <p>This service is not financial advice. Options trading involves substantial risk.</p>
    </main>
  )
}
