import { TRADE_FILTER_PROMPT_MAX } from '#/lib/sizing-types'

type Props = {
  prompt: string
  onChange: (prompt: string) => void
  onContinue: () => void
  onSkip: () => void
  saving: boolean
  error: string
}

export default function OnboardingPromptStep({
  prompt,
  onChange,
  onContinue,
  onSkip,
  saving,
  error,
}: Props) {
  return (
    <div className="island-shell space-y-5 rounded-2xl p-6">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]">Step 2 of 3</p>
        <h2 className="text-xl font-semibold text-[var(--sea-ink)]">Tell AI which trades to take</h2>
        <p className="mt-2 text-sm text-[var(--sea-ink-soft)]">
          Write personal rules for Discord and text alerts. After ticker and confidence checks, the model takes or
          skips each trade. Leave this empty to take every alert that already passes those filters.
          You can change this later in Settings.
        </p>
      </div>

      <label className="block text-sm">
        Trade filter prompt
        <textarea
          className="demo-textarea mt-1 w-full"
          rows={6}
          maxLength={TRADE_FILTER_PROMPT_MAX}
          placeholder="Only take 0DTE SPX/SPY. Skip calls. Skip if I already said no to similar setups."
          value={prompt}
          onChange={(e) => onChange(e.target.value)}
        />
        <span className="mt-1 block text-xs text-[var(--sea-ink-soft)]">
          {prompt.length}/{TRADE_FILTER_PROMPT_MAX}
        </span>
      </label>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={onContinue} disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? 'Saving…' : 'Continue'}
        </button>
        <button type="button" onClick={onSkip} disabled={saving} className="btn-secondary disabled:opacity-50">
          Skip for now
        </button>
      </div>
    </div>
  )
}
