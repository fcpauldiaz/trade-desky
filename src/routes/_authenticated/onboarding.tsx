import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { api } from '#/lib/api-client'
import type { UserSettings } from '#/lib/sizing-types'
import OnboardingDesktopStep from '#/components/onboarding/OnboardingDesktopStep'
import OnboardingPayStep from '#/components/onboarding/OnboardingPayStep'
import OnboardingPromptStep from '#/components/onboarding/OnboardingPromptStep'

export const Route = createFileRoute('/_authenticated/onboarding')({
  component: OnboardingPage,
})

function OnboardingPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [settings, setSettings] = useState<UserSettings>({
    default_mode: 'paper',
    max_contracts: 1,
    allowed_tickers: null,
    live_trading_enabled: false,
    sizing_mode: 'alert_inferred',
    fixed_contracts: 1,
    risk_percent: 1,
    default_broker: null,
    trade_filter_prompt: null,
  })
  const [prompt, setPrompt] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .settings()
      .then((loaded) => {
        setSettings(loaded)
        setPrompt(loaded.trade_filter_prompt || '')
      })
      .catch(() => {})
  }, [])

  async function savePromptAndContinue(nextPrompt: string) {
    setSaving(true)
    setError('')
    try {
      const updated = await api.updateSettings({
        ...settings,
        trade_filter_prompt: nextPrompt.trim() || null,
      })
      setSettings(updated)
      setPrompt(updated.trade_filter_prompt || '')
      setStep(3)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save prompt')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="page-wrap max-w-xl space-y-6 px-4 py-10">
      <header>
        <h1 className="app-page-title text-[var(--sea-ink)]">Get set up</h1>
        <p className="mt-2 text-sm text-[var(--sea-ink-soft)]">
          Install desktop capture, optionally add an AI trade filter, then subscribe.
        </p>
      </header>

      {step === 1 && <OnboardingDesktopStep onContinue={() => setStep(2)} />}

      {step === 2 && (
        <OnboardingPromptStep
          prompt={prompt}
          onChange={setPrompt}
          onContinue={() => savePromptAndContinue(prompt)}
          onSkip={() => setStep(3)}
          saving={saving}
          error={error}
        />
      )}

      {step === 3 && <OnboardingPayStep />}
    </main>
  )
}
