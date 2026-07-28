import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { api } from '#/lib/api-client'
import type { UserSettings } from '#/lib/sizing-types'
import OnboardingDesktopStep from '#/components/onboarding/OnboardingDesktopStep'
import OnboardingSizingStep from '#/components/onboarding/OnboardingSizingStep'
import OnboardingTestStep from '#/components/onboarding/OnboardingTestStep'

type OnboardingSearch = {
  broker?: string
}

export const Route = createFileRoute('/_authenticated/onboarding')({
  validateSearch: (search: Record<string, unknown>): OnboardingSearch => ({
    broker: typeof search.broker === 'string' ? search.broker : undefined,
  }),
  component: OnboardingPage,
})

function OnboardingPage() {
  const navigate = useNavigate()
  const { broker } = Route.useSearch()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [settings, setSettings] = useState<UserSettings>({
    default_mode: 'paper',
    max_contracts: 1,
    allowed_tickers: null,
    live_trading_enabled: false,
    sizing_mode: 'alert_inferred',
    fixed_contracts: 1,
    risk_percent: 1,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.settings().then(setSettings).catch(() => {})
  }, [])

  async function saveSizingAndContinue() {
    setSaving(true)
    setError('')
    try {
      await api.updateSettings(settings)
      setStep(3)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  async function finishOnboarding() {
    await api.completeOnboarding().catch(() => {})
    navigate({ to: '/dashboard' })
  }

  return (
    <main className="page-wrap max-w-xl space-y-6 px-4 py-10">
      <header>
        <h1 className="text-3xl font-bold text-[var(--sea-ink)]">Set up trading</h1>
        <p className="mt-2 text-sm text-[var(--sea-ink-soft)]">
          {broker ? `${broker} connected — ` : ''}install the desktop app, configure sizing, and verify your broker.
        </p>
      </header>

      {step === 1 && <OnboardingDesktopStep onContinue={() => setStep(2)} />}

      {step === 2 && (
        <OnboardingSizingStep
          settings={settings}
          onChange={setSettings}
          onContinue={saveSizingAndContinue}
          saving={saving}
          error={error}
        />
      )}

      {step === 3 && (
        <OnboardingTestStep
          broker={broker || 'broker'}
          defaultMode={settings.default_mode}
          onSkip={finishOnboarding}
          onComplete={finishOnboarding}
        />
      )}
    </main>
  )
}
