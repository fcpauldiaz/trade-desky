import { useState } from 'react'
import { api } from '#/lib/api-client'

type Props = {
  broker: string
  defaultMode: string
  onSkip: () => void
  onComplete: () => void
}

export default function OnboardingTestStep({ broker, defaultMode, onSkip, onComplete }: Props) {
  const [liveConfirmed, setLiveConfirmed] = useState(false)
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const isLive = defaultMode === 'live'

  async function runTest() {
    setTesting(true)
    setError('')
    setResult('')
    try {
      const res = await api.testBrokerOrder(broker)
      setResult(res.message)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Test failed')
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="island-shell space-y-5 rounded-2xl p-6">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]">Step 3 of 3</p>
        <h2 className="text-xl font-semibold text-[var(--sea-ink)]">Test your connection</h2>
        <p className="mt-2 text-sm text-[var(--sea-ink-soft)]">
          We&apos;ll place a 1-share SPY market buy through your connected <strong>{broker}</strong> broker using your
          default mode (<strong>{defaultMode}</strong>).
        </p>
      </div>

      {isLive && (
        <label className="flex items-start gap-2 rounded-xl border border-[rgba(180,120,40,0.35)] bg-[rgba(255,200,80,0.12)] p-4 text-sm">
          <input
            type="checkbox"
            checked={liveConfirmed}
            onChange={(e) => setLiveConfirmed(e.target.checked)}
            className="mt-0.5"
          />
          <span>I understand this will place a real 1-share SPY order in my live account.</span>
        </label>
      )}

      <button
        type="button"
        onClick={runTest}
        disabled={testing || (isLive && !liveConfirmed)}
        className="rounded-full bg-[var(--lagoon-deep)] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {testing ? 'Placing test order…' : 'Send test order'}
      </button>

      {result && <p className="text-sm text-green-700">{result}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex flex-wrap gap-3 pt-2">
        <button type="button" onClick={onSkip} className="rounded-full border border-[var(--line)] px-4 py-2 text-sm">
          Skip for now
        </button>
        <button
          type="button"
          onClick={onComplete}
          className="rounded-full bg-[var(--lagoon-deep)] px-4 py-2 text-sm font-semibold text-white"
        >
          Go to dashboard
        </button>
      </div>
    </div>
  )
}
