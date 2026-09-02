import { Link } from '@tanstack/react-router'
import { SUPPORT_EMAIL } from '#/lib/site'

export default function OnboardingPayStep() {
  return (
    <div className="island-shell space-y-5 rounded-2xl p-6">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]">
          Step 3 of 3
        </p>
        <h2 className="text-xl font-semibold text-[var(--sea-ink)]">Pro access required</h2>
        <p className="mt-2 text-sm text-[var(--sea-ink-soft)]">
          Pro unlocks alert execution and broker connections. Access is granted by invitation —
          there is no self-serve checkout.
        </p>
      </div>

      <p className="text-sm text-[var(--sea-ink-soft)]">
        Email{' '}
        <a className="underline" href={`mailto:${SUPPORT_EMAIL}`}>
          {SUPPORT_EMAIL}
        </a>{' '}
        from the address on this account. Once Pro is enabled, continue to connect a broker.
      </p>

      <div className="flex flex-wrap gap-3">
        <a className="btn-primary" href={`mailto:${SUPPORT_EMAIL}?subject=Trade%20Desky%20Pro%20access`}>
          Request Pro access
        </a>
        <Link to="/billing" className="btn-secondary">
          View billing status
        </Link>
      </div>
    </div>
  )
}
