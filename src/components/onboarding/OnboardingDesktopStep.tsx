import { DESKTOP_APP_NAME, DESKTOP_MAC_ASSET_PATH, DESKTOP_WIN_ASSET_PATH } from '#/lib/desktop-app'

type Props = {
  onContinue: () => void
}

export default function OnboardingDesktopStep({ onContinue }: Props) {
  return (
    <div className="island-shell space-y-5 rounded-2xl p-6">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]">Step 1 of 3</p>
        <h2 className="text-xl font-semibold text-[var(--sea-ink)]">Install {DESKTOP_APP_NAME}</h2>
        <p className="mt-2 text-sm text-[var(--sea-ink-soft)]">
          The desktop app captures Discord-style alert notifications and forwards them to your account — no webhook
          URL to copy. You can install it now or after you subscribe.
        </p>
      </div>

      <ol className="space-y-2 text-sm text-[var(--sea-ink-soft)]">
        <li>1. Download and install the app for your platform</li>
        <li>2. Grant notification permissions when prompted</li>
        <li>3. Sign in with the same email and password you use here</li>
      </ol>

      <div className="flex flex-wrap gap-3">
        <a href={DESKTOP_MAC_ASSET_PATH} className="btn-primary">
          Download for macOS
        </a>
        <a href={DESKTOP_WIN_ASSET_PATH} className="btn-secondary">
          Download for Windows
        </a>
      </div>

      <button type="button" onClick={onContinue} className="btn-primary">
        Continue
      </button>
    </div>
  )
}
