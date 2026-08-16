import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { api, type CheckoutPlan } from '#/lib/api-client'
import UpgradeBanner from '#/components/UpgradeBanner'
import { SUPPORT_EMAIL } from '#/lib/site'

type BillingSearch = {
  checkout_id?: string
}

export const Route = createFileRoute('/_authenticated/billing')({
  validateSearch: (search: Record<string, unknown>): BillingSearch => ({
    checkout_id: typeof search.checkout_id === 'string' ? search.checkout_id : undefined,
  }),
  component: BillingPage,
})

function BillingPage() {
  const navigate = useNavigate()
  const { checkout_id: checkoutId } = Route.useSearch()
  const [billing, setBilling] = useState<Awaited<ReturnType<typeof api.billing>> | null>(null)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [loadingAction, setLoadingAction] = useState<'monthly' | 'yearly' | 'portal' | null>(null)
  const [confirming, setConfirming] = useState(Boolean(checkoutId))
  const skipBillingFetchRef = useRef(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setError('')
      try {
        if (checkoutId) {
          setConfirming(true)
          const confirmed = await api.confirmCheckout(checkoutId)
          if (cancelled) return
          setBilling(confirmed)
          skipBillingFetchRef.current = true
          void navigate({ to: '/billing', search: {}, replace: true })
          return
        }
        if (skipBillingFetchRef.current) {
          skipBillingFetchRef.current = false
          return
        }
        const data = await api.billing()
        if (!cancelled) setBilling(data)
      } catch (err) {
        if (cancelled) return
        if (checkoutId) {
          setError(err instanceof Error ? err.message : 'Could not confirm checkout')
          try {
            const data = await api.billing()
            if (!cancelled) setBilling(data)
          } catch {
          }
        } else {
          setError('Could not load billing')
        }
      } finally {
        if (!cancelled) setConfirming(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [checkoutId, navigate])

  async function startCheckout(plan: CheckoutPlan) {
    setActionError('')
    setLoadingAction(plan)
    try {
      const { checkout_url } = await api.createCheckout(plan)
      window.location.assign(checkout_url)
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not start checkout')
      setLoadingAction(null)
    }
  }

  async function openPortal() {
    setActionError('')
    setLoadingAction('portal')
    try {
      const { url } = await api.createBillingPortal()
      window.location.assign(url)
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not open billing portal')
      setLoadingAction(null)
    }
  }

  return (
    <main className="page-wrap max-w-2xl space-y-6 px-4 py-10">
      <h1 className="text-3xl font-bold">Billing</h1>
      {confirming && <p className="text-sm text-[var(--muted-foreground)]">Confirming your subscription…</p>}
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
      <div className="flex flex-wrap gap-3">
        {!billing?.can_process_trades ? (
          <>
            <button
              type="button"
              className="btn-primary"
              onClick={() => startCheckout('monthly')}
              disabled={loadingAction !== null || confirming}
            >
              {loadingAction === 'monthly' ? 'Starting checkout…' : 'Subscribe monthly'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => startCheckout('yearly')}
              disabled={loadingAction !== null || confirming}
            >
              {loadingAction === 'yearly' ? 'Starting checkout…' : 'Subscribe yearly'}
            </button>
          </>
        ) : (
          <button
            type="button"
            className="btn-primary"
            onClick={openPortal}
            disabled={loadingAction !== null || confirming}
          >
            {loadingAction === 'portal' ? 'Opening…' : 'Manage subscription'}
          </button>
        )}
        <Link to="/pricing" className="btn-secondary">
          View pricing
        </Link>
      </div>
      {actionError ? <p className="text-sm text-red-600">{actionError}</p> : null}
      <p className="text-sm text-[var(--muted-foreground)]">
        Billing help:{' '}
        <a className="underline" href={`mailto:${SUPPORT_EMAIL}`}>
          {SUPPORT_EMAIL}
        </a>
      </p>
    </main>
  )
}
