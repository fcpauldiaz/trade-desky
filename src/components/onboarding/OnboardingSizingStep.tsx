import type { SizingMode, UserSettings } from '#/lib/sizing-types'

type Props = {
  settings: UserSettings
  onChange: (settings: UserSettings) => void
  onContinue: () => void
  saving: boolean
  error: string
}

const MODES: { id: SizingMode; title: string; description: string }[] = [
  {
    id: 'alert_inferred',
    title: 'From alerts',
    description: 'Use contract count from the alert when present (AI or rules). Defaults to 1.',
  },
  {
    id: 'fixed',
    title: 'Fixed per trade',
    description: 'Always trade the same number of contracts on every alert.',
  },
  {
    id: 'risk_percent',
    title: 'Risk-based',
    description: 'Size each trade as a percentage of your account equity.',
  },
]

export default function OnboardingSizingStep({ settings, onChange, onContinue, saving, error }: Props) {
  return (
    <div className="island-shell space-y-5 rounded-2xl p-6">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]">Step 2 of 3</p>
        <h2 className="text-xl font-semibold text-[var(--sea-ink)]">Choose your trade sizing</h2>
        <p className="mt-2 text-sm text-[var(--sea-ink-soft)]">
          Pick how many contracts to trade when an alert comes in. You can change this later in Settings.
        </p>
      </div>

      <div className="space-y-3">
        {MODES.map((mode) => (
          <label
            key={mode.id}
            className={`block cursor-pointer rounded-xl border p-4 ${
              settings.sizing_mode === mode.id ? 'border-[var(--lagoon-deep)] bg-[rgba(79,184,178,0.08)]' : 'border-[var(--line)]'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="radio"
                name="sizing_mode"
                checked={settings.sizing_mode === mode.id}
                onChange={() => onChange({ ...settings, sizing_mode: mode.id })}
                className="mt-1"
              />
              <div>
                <p className="m-0 font-semibold text-[var(--sea-ink)]">{mode.title}</p>
                <p className="m-0 mt-1 text-sm text-[var(--sea-ink-soft)]">{mode.description}</p>
              </div>
            </div>
          </label>
        ))}
      </div>

      {settings.sizing_mode === 'fixed' && (
        <label className="block text-sm">
          Contracts per trade
          <input
            type="number"
            min={1}
            max={100}
            className="mt-1 w-full rounded-lg border border-[var(--line)] bg-transparent px-3 py-2"
            value={settings.fixed_contracts}
            onChange={(e) => onChange({ ...settings, fixed_contracts: Number(e.target.value) })}
          />
        </label>
      )}

      {settings.sizing_mode === 'risk_percent' && (
        <label className="block text-sm">
          Risk per trade (% of account)
          <input
            type="number"
            min={0.1}
            max={100}
            step={0.1}
            className="mt-1 w-full rounded-lg border border-[var(--line)] bg-transparent px-3 py-2"
            value={settings.risk_percent}
            onChange={(e) => onChange({ ...settings, risk_percent: Number(e.target.value) })}
          />
        </label>
      )}

      <label className="block text-sm">
        Max contracts (safety cap)
        <input
          type="number"
          min={1}
          max={100}
          className="mt-1 w-full rounded-lg border border-[var(--line)] bg-transparent px-3 py-2"
          value={settings.max_contracts}
          onChange={(e) => onChange({ ...settings, max_contracts: Number(e.target.value) })}
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="button"
        onClick={onContinue}
        disabled={saving}
        className="rounded-full bg-[var(--lagoon-deep)] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {saving ? 'Saving…' : 'Continue'}
      </button>
    </div>
  )
}
