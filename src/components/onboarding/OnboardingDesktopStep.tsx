import { DESKTOP_APP_RELEASES_URL } from '#/lib/desktop-app'

type Props = {
  onContinue: () => void
}

export default function OnboardingDesktopStep({ onContinue }: Props) {
  return (
    <div className="island-shell space-y-5 rounded-2xl p-6">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]">Step 1 of 3</p>
        <h2 className="text-xl font-semibold text-[var(--sea-ink)]">Install Notification Watcher</h2>
        <p className="mt-2 text-sm text-[var(--sea-ink-soft)]">
          Download the desktop app for macOS or Windows. It captures alert notifications and forwards them to your
          account — no webhook URL to copy.
        </p>
      </div>

      <ol className="space-y-2 text-sm text-[var(--sea-ink-soft)]">
        <li>1. Download and install the app for your platform</li>
        <li>2. Grant notification permissions when prompted</li>
        <li>3. Sign in with the same email and password you use here</li>
      </ol>

      <div className="flex flex-wrap gap-3">
        <a
          href={DESKTOP_APP_RELEASES_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-[var(--lagoon-deep)] px-5 py-2.5 text-sm font-semibold text-white"
        >
          Download for macOS
        </a>
        <a
          href={DESKTOP_APP_RELEASES_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-[var(--line)] px-5 py-2.5 text-sm font-semibold"
        >
          Download for Windows
        </a>
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="rounded-full bg-[var(--lagoon-deep)] px-5 py-2.5 text-sm font-semibold text-white"
      >
        Continue
      </button>
    </div>
  )
}
