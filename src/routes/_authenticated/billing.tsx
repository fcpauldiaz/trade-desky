import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import UpgradeBanner from '#/components/UpgradeBanner'
import { api } from '#/lib/api-client'
import { SUPPORT_EMAIL } from '#/lib/site'
import { invalidateCanProcessTradesCache } from '#/lib/use-can-process-trades'

export const Route = createFileRoute('/_authenticated/billing')({
  component: BillingPage,
})

function BillingPage() {
  const [billing, setBilling] = useState<Awaited<ReturnType<typeof api.billing>> | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    void api
      .billing()
      .then((data) => {
        if (cancelled) return
        setBilling(data)
        invalidateCanProcessTradesCache()
      })
      .catch(() => {
        if (!cancelled) setError('Could not load billing')
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main className="page-wrap max-w-2xl space-y-6 px-4 py-10">
      <h1 className="text-3xl font-bold">Billing</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {billing && !billing.can_process_trades && <UpgradeBanner />}
      {billing && (
        <div className="island-shell space-y-2 rounded-2xl p-5 text-sm">
          <p>
            <strong>Status:</strong> {billing.status}
          </p>
          <p>
            <strong>Plan:</strong> {billing.plan_name}
          </p>
          {billing.renews_at && (
            <p>
              <strong>Renews:</strong> {new Date(billing.renews_at).toLocaleDateString()}
            </p>
          )}
          {billing.ends_at && (
            <p>
              <strong>Ends:</strong> {new Date(billing.ends_at).toLocaleDateString()}
            </p>
          )}
          <p>
            <strong>Can process trades:</strong> {billing.can_process_trades ? 'Yes' : 'No'}
          </p>
        </div>
      )}
      {!billing?.can_process_trades ? (
        <p className="text-sm text-[var(--muted-foreground)]">
          Pro is enabled by invitation. Email{' '}
          <a className="underline" href={`mailto:${SUPPORT_EMAIL}`}>
            {SUPPORT_EMAIL}
          </a>{' '}
          from your account address, or see <Link to="/pricing">pricing</Link>.
        </p>
      ) : null}
      <p className="text-sm text-[var(--muted-foreground)]">
        Billing help:{' '}
        <a className="underline" href={`mailto:${SUPPORT_EMAIL}`}>
          {SUPPORT_EMAIL}
        </a>
      </p>
    </main>
  )
}
