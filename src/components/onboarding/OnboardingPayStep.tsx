import { useState } from 'react'
import { api, type CheckoutPlan } from '#/lib/api-client'
import { PRO_PRICE_LABEL, PRO_YEARLY_PRICE_LABEL, PRO_YEARLY_SAVINGS_PILL } from '#/lib/site'

export default function OnboardingPayStep() {
  const [plan, setPlan] = useState<CheckoutPlan>('yearly')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function startCheckout() {
    setError('')
    setLoading(true)
    try {
      const { checkout_url } = await api.createCheckout(plan)
      window.location.assign(checkout_url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not start checkout')
      setLoading(false)
    }
  }

  return (
    <div className="island-shell space-y-5 rounded-2xl p-6">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]">Step 3 of 3</p>
        <h2 className="text-xl font-semibold text-[var(--sea-ink)]">Subscribe to start executing</h2>
        <p className="mt-2 text-sm text-[var(--sea-ink-soft)]">
          Pro unlocks alert execution and broker connections. After checkout you will connect Tradier or Schwab.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          className={`feature-item text-left ${plan === 'monthly' ? 'ring-2 ring-black' : ''}`}
          onClick={() => setPlan('monthly')}
        >
          <p className="font-semibold">Monthly</p>
          <p className="mt-1 text-2xl font-black">
            {PRO_PRICE_LABEL}
            <span className="text-sm font-semibold text-[var(--sea-ink-soft)]">/mo</span>
          </p>
        </button>
        <button
          type="button"
          className={`feature-item text-left ${plan === 'yearly' ? 'ring-2 ring-black' : ''}`}
          onClick={() => setPlan('yearly')}
        >
          <p className="text-xs font-semibold">{PRO_YEARLY_SAVINGS_PILL}</p>
          <p className="font-semibold">Yearly</p>
          <p className="mt-1 text-2xl font-black">
            {PRO_YEARLY_PRICE_LABEL}
            <span className="text-sm font-semibold text-[var(--sea-ink-soft)]">/yr</span>
          </p>
        </button>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button type="button" onClick={startCheckout} disabled={loading} className="btn-primary disabled:opacity-50">
        {loading ? 'Starting checkout…' : 'Subscribe'}
      </button>
    </div>
  )
}
