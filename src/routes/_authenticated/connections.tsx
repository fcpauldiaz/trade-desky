import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { api, type BrokerConnection, type TradierEnvironment } from '#/lib/api-client'
import UpgradeBanner from '#/components/UpgradeBanner'

export const Route = createFileRoute('/_authenticated/connections')({ component: ConnectionsPage })

function ConnectionsPage() {
  const navigate = useNavigate()
  const [brokers, setBrokers] = useState<BrokerConnection[]>([])
  const [canTrade, setCanTrade] = useState(false)
  const [defaultBroker, setDefaultBroker] = useState<string | null>(null)
  const [testMsg, setTestMsg] = useState<Record<string, string>>({})
  const [testing, setTesting] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [tradierToken, setTradierToken] = useState('')
  const [tradierAccountId, setTradierAccountId] = useState('')
  const [tradierEnvironment, setTradierEnvironment] = useState<TradierEnvironment>('sandbox')
  const [savingTradier, setSavingTradier] = useState(false)

  const tradier = brokers.find((b) => b.broker === 'tradier')
  const tradierConnected = tradier?.status === 'connected'

  async function refreshBrokers() {
    const [list, settings] = await Promise.all([api.brokers(), api.settings()])
    setBrokers(list)
    setDefaultBroker(settings.default_broker)
    const connected = list.find((b) => b.broker === 'tradier' && b.status === 'connected')
    if (connected?.environment === 'sandbox' || connected?.environment === 'live') {
      setTradierEnvironment(connected.environment)
    }
  }

  useEffect(() => {
    api.billing().then((b) => setCanTrade(b.can_process_trades)).catch(() => setError('Could not load billing'))
    refreshBrokers().catch(() => setError('Could not load brokers'))

    const params = new URLSearchParams(window.location.search)
    const connected = params.get('connected')
    if (connected) {
      window.history.replaceState({}, '', '/connections')
      navigate({ to: '/dashboard' })
    }
  }, [navigate])

  async function connectTradierOAuth() {
    try {
      const { url } = await api.tradierAuthorize(tradierEnvironment)
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
        environment: tradierEnvironment,
      })
      setTradierToken('')
      setTradierAccountId('')
      await refreshBrokers()
      if (!tradierConnected) {
        navigate({ to: '/dashboard' })
      }
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

  function environmentLabel(environment: string | null | undefined) {
    if (environment === 'live') return 'live'
    if (environment === 'sandbox') return 'paper'
    return null
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
                {b.broker}: {b.status}
                {b.account_id && ` (${b.account_id})`}
                {environmentLabel(b.environment) && ` — ${environmentLabel(b.environment)}`}
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
                {tradierConnected
                  ? 'Switch paper/live by selecting an environment and pasting the matching API token.'
                  : 'Connect with your personal API token from '}
                {!tradierConnected && (
                  <a
                    href="https://dash.tradier.com/settings/api"
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    Tradier API settings
                  </a>
                )}
                {!tradierConnected && '. Sandbox token for paper, production token for live.'}
              </p>
            </div>
            <form onSubmit={connectTradierToken} className="space-y-3">
              <fieldset className="space-y-2">
                <legend className="text-sm font-medium">Environment</legend>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="tradier-environment"
                    checked={tradierEnvironment === 'sandbox'}
                    onChange={() => setTradierEnvironment('sandbox')}
                  />
                  Paper (sandbox)
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="tradier-environment"
                    checked={tradierEnvironment === 'live'}
                    onChange={() => setTradierEnvironment('live')}
                  />
                  Live (production)
                </label>
              </fieldset>
              <label className="block text-sm">
                Access token
                <input
                  type="password"
                  autoComplete="off"
                  className="demo-input mt-1 w-full"
                  value={tradierToken}
                  onChange={(e) => setTradierToken(e.target.value)}
                  placeholder={
                    tradierEnvironment === 'sandbox'
                      ? 'Paste sandbox API token'
                      : 'Paste production API token'
                  }
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
                {savingTradier
                  ? 'Saving…'
                  : tradierConnected
                    ? `Switch to ${tradierEnvironment === 'sandbox' ? 'paper' : 'live'}`
                    : 'Connect with API token'}
              </button>
            </form>
            <div className="border-t border-[var(--line)] pt-4">
              <p className="mb-2 text-xs text-[var(--sea-ink-soft)]">
                Partner OAuth (requires TRADIER_CLIENT_ID / SECRET on the server):
              </p>
              <button type="button" onClick={connectTradierOAuth} className="rounded-full border px-4 py-2 text-sm">
                Connect via OAuth ({tradierEnvironment === 'sandbox' ? 'paper' : 'live'})
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
