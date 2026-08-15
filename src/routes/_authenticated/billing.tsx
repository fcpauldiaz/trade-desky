import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { api } from '#/lib/api-client'
import { checkoutUrl } from '#/lib/creem'
import UpgradeBanner from '#/components/UpgradeBanner'

export const Route = createFileRoute('/_authenticated/billing')({ component: BillingPage })

function BillingPage() {
  const [billing, setBilling] = useState<Awaited<ReturnType<typeof api.billing>> | null>(null)
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.billing().then(setBilling).catch(() => setError('Could not load billing'))
    api.me().then((u) => setUser({ id: u.id, email: u.email })).catch(() => {})
  }, [])

  const manageUrl = billing?.customer_portal_url || (user ? checkoutUrl(user.id, user.email) : '#')

  return (
    <main className="page-wrap max-w-2xl space-y-6 px-4 py-10">
      <h1 className="text-3xl font-bold">Billing</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {billing && !billing.can_process_trades && <UpgradeBanner />}
      {billing && (
        <div className="island-shell space-y-2 rounded-2xl p-5 text-sm">
          <p><strong>Status:</strong> {billing.status}</p>
          <p><strong>Plan:</strong> {billing.plan_name}</p>
          {billing.renews_at && <p><strong>Renews:</strong> {new Date(billing.renews_at).toLocaleDateString()}</p>}
          {billing.ends_at && <p><strong>Ends:</strong> {new Date(billing.ends_at).toLocaleDateString()}</p>}
          <p><strong>Can process trades:</strong> {billing.can_process_trades ? 'Yes' : 'No'}</p>
        </div>
      )}
      {user && (
        <a href={manageUrl} target="_blank" rel="noreferrer" className="inline-block rounded-full bg-[var(--lagoon-deep)] px-5 py-2 text-white no-underline">
          Manage subscription
        </a>
      )}
    </main>
  )
}
