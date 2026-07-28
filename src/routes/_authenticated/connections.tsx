import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { api } from '#/lib/api-client'
import UpgradeBanner from '#/components/UpgradeBanner'

export const Route = createFileRoute('/_authenticated/connections')({ component: ConnectionsPage })

function ConnectionsPage() {
  const navigate = useNavigate()
  const [brokers, setBrokers] = useState<Awaited<ReturnType<typeof api.brokers>>>([])
  const [canTrade, setCanTrade] = useState(false)
  const [defaultBroker, setDefaultBroker] = useState<string | null>(null)
  const [testMsg, setTestMsg] = useState<Record<string, string>>({})
  const [testing, setTesting] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [tradierToken, setTradierToken] = useState('')
  const [tradierAccountId, setTradierAccountId] = useState('')
  const [savingTradier, setSavingTradier] = useState(false)

  async function refreshBrokers() {
    const [list, settings] = await Promise.all([api.brokers(), api.settings()])
    setBrokers(list)
    setDefaultBroker(settings.default_broker)
  }

  useEffect(() => {
    api.billing().then((b) => setCanTrade(b.can_process_trades)).catch(() => setError('Could not load billing'))
    refreshBrokers().catch(() => setError('Could not load brokers'))

    const params = new URLSearchParams(window.location.search)
    const connected = params.get('connected')
    if (connected) {
      window.history.replaceState({}, '', '/connections')
      navigate({ to: '/onboarding', search: { broker: connected } })
    }
  }, [navigate])

  async function connectTradierOAuth() {
    try {
      const { url } = await api.tradierAuthorize()
      window.location.href = url
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Tradier OAuth connect failed')
    }
  }

  async function connectTradierToken(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSavingTradier(true)
    try {
      await api.tradierConnectToken({
        access_token: tradierToken.trim(),
        account_id: tradierAccountId.trim() || undefined,
      })
      setTradierToken('')
      setTradierAccountId('')
      await refreshBrokers()
      navigate({ to: '/onboarding', search: { broker: 'tradier' } })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tradier token connect failed')
    } finally {
      setSavingTradier(false)
    }
  }

  async function connectSchwab() {
    try {
      const { url } = await api.schwabAuthorize()
      window.location.href = url
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Schwab connect failed')
    }
  }

  async function testConnection(broker: string) {
    setTesting(broker)
    try {
      const res = await api.testBrokerOrder(broker)
      setTestMsg((prev) => ({ ...prev, [broker]: res.message }))
    } catch (e) {
      setTestMsg((prev) => ({ ...prev, [broker]: e instanceof Error ? e.message : 'Test failed' }))
    } finally {
      setTesting(null)
    }
  }

  async function setDefault(broker: string) {
    await api.setDefaultBroker(broker)
    setDefaultBroker(broker)
  }

  async function disconnect(broker: string) {
    await api.disconnectBroker(broker)
    await refreshBrokers()
  }

  return (
    <main className="page-wrap max-w-2xl space-y-6 px-4 py-10">
      <h1 className="text-3xl font-bold">Broker connections</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!canTrade && <UpgradeBanner />}
      <ul className="space-y-2 text-sm">
        {brokers.map((b) => (
          <li key={b.broker} className="island-shell rounded-xl px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span>
                {b.broker}: {b.status} {b.account_id && `(${b.account_id})`}
                {defaultBroker === b.broker && ' — default'}
              </span>
              {b.status === 'connected' && canTrade && (
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => setDefault(b.broker)} className="rounded-full border px-3 py-1 text-xs">
                    Set default
                  </button>
                  <button type="button" onClick={() => testConnection(b.broker)} disabled={testing === b.broker} className="rounded-full border px-3 py-1 text-xs">
                    {testing === b.broker ? 'Testing…' : 'Test'}
                  </button>
                  <button type="button" onClick={() => disconnect(b.broker)} className="rounded-full border px-3 py-1 text-xs">
                    Disconnect
                  </button>
                </div>
              )}
            </div>
            {testMsg[b.broker] && <p className="mt-2 text-xs text-[var(--sea-ink-soft)]">{testMsg[b.broker]}</p>}
          </li>
        ))}
      </ul>
      {canTrade && (
        <div className="space-y-4">
          <div className="island-shell space-y-4 rounded-2xl p-5">
            <div>
              <h2 className="font-semibold">Tradier</h2>
              <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">
                Use your personal API token from{' '}
                <a
                  href="https://dash.tradier.com/settings/api"
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  Tradier API settings
                </a>
                . Match sandbox vs live with the receiver&apos;s <code>TRADIER_API_BASE</code>.
              </p>
            </div>
            <form onSubmit={connectTradierToken} className="space-y-3">
              <label className="block text-sm">
                Access token
                <input
                  type="password"
                  autoComplete="off"
                  className="demo-input mt-1 w-full"
                  value={tradierToken}
                  onChange={(e) => setTradierToken(e.target.value)}
                  placeholder="Paste sandbox or production API token"
                  required
                />
              </label>
              <label className="block text-sm">
                Account id <span className="text-[var(--sea-ink-soft)]">(optional)</span>
                <input
                  type="text"
                  autoComplete="off"
                  className="demo-input mt-1 w-full"
                  value={tradierAccountId}
                  onChange={(e) => setTradierAccountId(e.target.value)}
                  placeholder="Auto-detected from profile if empty"
                />
              </label>
              <button
                type="submit"
                disabled={savingTradier || !tradierToken.trim()}
                className="rounded-full bg-[var(--lagoon-deep)] px-4 py-2 text-sm text-white disabled:opacity-50"
              >
                {savingTradier ? 'Connecting…' : 'Connect with API token'}
              </button>
            </form>
            <div className="border-t border-[var(--line)] pt-4">
              <p className="mb-2 text-xs text-[var(--sea-ink-soft)]">
                Partner OAuth (requires TRADIER_CLIENT_ID / SECRET on the server):
              </p>
              <button type="button" onClick={connectTradierOAuth} className="rounded-full border px-4 py-2 text-sm">
                Connect via OAuth
              </button>
            </div>
          </div>
          <div className="island-shell rounded-2xl p-5">
            <h2 className="mb-3 font-semibold">Charles Schwab</h2>
            <button type="button" onClick={connectSchwab} className="rounded-full border px-4 py-2 text-sm">
              Authorize Schwab
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
