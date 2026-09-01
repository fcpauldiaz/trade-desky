import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react'
import {
  api,
  DEFAULT_NINJATRADER_TEST_ORDER,
  type BrokerConnection,
  type InboundWebhook,
  type TradierEnvironment,
} from '#/lib/api-client'
import { NINJATRADER_BRIDGE_DOCS_URL } from '#/lib/brokers'
import UpgradeBanner from '#/components/UpgradeBanner'

export const Route = createFileRoute('/_authenticated/connections')({ component: ConnectionsPage })

async function copyText(value: string): Promise<boolean> {
  if (typeof navigator.clipboard?.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(value)
      return true
    } catch {
      return false
    }
  }
  return false
}

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
  const [forwardUrl, setForwardUrl] = useState('')
  const [bridgeWebhookSecret, setBridgeWebhookSecret] = useState('')
  const [accountLabel, setAccountLabel] = useState('')
  const [savingNinjatrader, setSavingNinjatrader] = useState(false)
  const [webhooks, setWebhooks] = useState<InboundWebhook[]>([])
  const [revealedSecrets, setRevealedSecrets] = useState<Record<string, string>>({})
  const [webhookName, setWebhookName] = useState('')
  const [webhookLoading, setWebhookLoading] = useState<string | null>(null)
  const [copyFeedback, setCopyFeedback] = useState('')

  const tradier = brokers.find((b) => b.broker === 'tradier')
  const tradierConnected = tradier?.status === 'connected'
  const ninjatrader = brokers.find((b) => b.broker === 'ninjatrader')
  const ninjatraderConnected = ninjatrader?.status === 'connected'

  const refreshBrokers = useCallback(async () => {
    const [list, settings] = await Promise.all([api.brokers(), api.settings()])
    setBrokers(list)
    setDefaultBroker(settings.default_broker)
    const connectedTradier = list.find((b) => b.broker === 'tradier' && b.status === 'connected')
    if (connectedTradier?.environment === 'sandbox' || connectedTradier?.environment === 'live') {
      setTradierEnvironment(connectedTradier.environment)
    }
    const connectedNt = list.find((b) => b.broker === 'ninjatrader' && b.status === 'connected')
    if (connectedNt?.account_id) {
      setAccountLabel(connectedNt.account_id)
    }
  }, [])

  const refreshWebhooks = useCallback(async () => {
    try {
      const data = await api.webhooks()
      setWebhooks(data)
    } catch {
      setWebhooks([])
    }
  }, [])

  useEffect(() => {
    api.billing().then((b) => setCanTrade(b.can_process_trades)).catch(() => setError('Could not load billing'))
    refreshBrokers().catch(() => setError('Could not load brokers'))
    refreshWebhooks().catch(() => {})

    const params = new URLSearchParams(window.location.search)
    const connected = params.get('connected')
    if (connected) {
      window.history.replaceState({}, '', '/connections')
      navigate({ to: '/dashboard' })
    }
  }, [navigate, refreshBrokers, refreshWebhooks])

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

  async function connectNinjatrader(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSavingNinjatrader(true)
    try {
      const result = await api.ninjatraderConnect({
        forward_url: forwardUrl.trim(),
        webhook_secret: bridgeWebhookSecret.trim() || undefined,
        account_label: accountLabel.trim() || undefined,
      })
      setForwardUrl(result.forward_url)
      setBridgeWebhookSecret('')
      await refreshBrokers()
      if (!ninjatraderConnected) {
        navigate({ to: '/dashboard' })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'NinjaTrader connect failed')
    } finally {
      setSavingNinjatrader(false)
    }
  }

  async function testConnection(broker: string) {
    setTesting(broker)
    try {
      const res =
        broker === 'ninjatrader'
          ? await api.testBrokerOrder(broker, DEFAULT_NINJATRADER_TEST_ORDER)
          : await api.testBrokerOrder(broker)
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
    if (broker === 'ninjatrader') {
      setForwardUrl('')
      setAccountLabel('')
      setBridgeWebhookSecret('')
    }
    await refreshBrokers()
  }

  async function createWebhook() {
    setError('')
    setWebhookLoading('create')
    try {
      const created = await api.createWebhook({ name: webhookName.trim() })
      setWebhookName('')
      setRevealedSecrets((prev) => ({ ...prev, [created.id]: created.secret }))
      await refreshWebhooks()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create webhook')
    } finally {
      setWebhookLoading(null)
    }
  }

  async function rotateWebhook(id: string) {
    setError('')
    setWebhookLoading(id)
    try {
      const rotated = await api.rotateWebhookSecret(id)
      setRevealedSecrets((prev) => ({ ...prev, [id]: rotated.secret }))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not rotate webhook secret')
    } finally {
      setWebhookLoading(null)
    }
  }

  async function removeWebhook(id: string) {
    setError('')
    setWebhookLoading(id)
    try {
      await api.deleteWebhook(id)
      setRevealedSecrets((prev) => {
        const next = { ...prev }
        delete next[id]
        return next
      })
      await refreshWebhooks()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not remove webhook')
    } finally {
      setWebhookLoading(null)
    }
  }

  async function handleCopy(value: string) {
    const ok = await copyText(value)
    setCopyFeedback(ok ? 'Copied' : 'Copy failed')
    window.setTimeout(() => setCopyFeedback(''), 2000)
  }

  function environmentLabel(environment: string | null | undefined) {
    if (environment === 'live') return 'live'
    if (environment === 'sandbox') return 'paper'
    return null
  }

  function brokerLabel(broker: string) {
    if (broker === 'ninjatrader') return 'NinjaTrader'
    return broker
  }

  function webhookTitle(webhook: InboundWebhook) {
    return webhook.name.trim() || `Webhook ${webhook.id.slice(0, 8)}`
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
                {brokerLabel(b.broker)}: {b.status}
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
          <div className="island-shell space-y-4 rounded-2xl p-5">
            <div>
              <h2 className="font-semibold">NinjaTrader</h2>
              <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">
                Futures execution via a local bridge. Install{' '}
                <a className="underline" href={NINJATRADER_BRIDGE_DOCS_URL} rel="noreferrer" target="_blank">
                  trade-desky-ninjatrader
                </a>
                , pick your account in the NinjaTrader panel, then paste the bridge HTTPS webhook URL below.
              </p>
            </div>
            <form onSubmit={connectNinjatrader} className="space-y-3">
              <label className="block text-sm">
                Forward URL
                <input
                  type="url"
                  autoComplete="off"
                  className="demo-input mt-1 w-full"
                  value={forwardUrl}
                  onChange={(e) => setForwardUrl(e.target.value)}
                  placeholder="https://….trycloudflare.com/webhook"
                  required
                />
              </label>
              <label className="block text-sm">
                Bridge webhook secret <span className="text-[var(--sea-ink-soft)]">(optional)</span>
                <input
                  type="password"
                  autoComplete="off"
                  className="demo-input mt-1 w-full"
                  value={bridgeWebhookSecret}
                  onChange={(e) => setBridgeWebhookSecret(e.target.value)}
                  placeholder="Only if your local bridge requires it"
                />
              </label>
              <label className="block text-sm">
                Account label <span className="text-[var(--sea-ink-soft)]">(optional)</span>
                <input
                  type="text"
                  autoComplete="off"
                  className="demo-input mt-1 w-full"
                  value={accountLabel}
                  onChange={(e) => setAccountLabel(e.target.value)}
                  placeholder="Note shown in Connections — account is chosen in NT"
                />
              </label>
              <button
                type="submit"
                disabled={savingNinjatrader || !forwardUrl.trim()}
                className="btn-primary text-sm disabled:opacity-50"
              >
                {savingNinjatrader
                  ? 'Saving…'
                  : ninjatraderConnected
                    ? 'Update NinjaTrader'
                    : 'Connect NinjaTrader'}
              </button>
            </form>
            <div className="border-t border-[var(--line)] pt-4 space-y-3">
              <h3 className="text-sm font-semibold">Inbound JSON webhooks</h3>
              <p className="text-xs text-[var(--sea-ink-soft)]">
                Discord bots, TradingView, or custom systems can POST JSON to a Trade Desky webhook
                URL. We parse with AI and route futures to NinjaTrader when it is your default
                execution target. Send the secret in the{' '}
                <code className="text-xs">X-Webhook-Secret</code> header.
              </p>
              {webhooks.length > 0 && (
                <ul className="space-y-3">
                  {webhooks.map((hook) => (
                    <li key={hook.id} className="feature-item space-y-2 p-3 text-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-semibold">{webhookTitle(hook)}</span>
                        <span className="text-xs text-[var(--sea-ink-soft)]">
                          {hook.enabled ? 'enabled' : 'disabled'}
                        </span>
                      </div>
                      <label className="block">
                        Webhook URL
                        <div className="mt-1 flex gap-2">
                          <input type="text" readOnly className="demo-input flex-1 text-xs" value={hook.url} />
                          <button type="button" className="rounded-full border px-3 py-1 text-xs" onClick={() => handleCopy(hook.url)}>
                            Copy
                          </button>
                        </div>
                      </label>
                      {revealedSecrets[hook.id] && (
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-amber-800">
                            Save this secret now — it is only shown once.
                          </p>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              readOnly
                              className="demo-input flex-1 font-mono text-xs"
                              value={revealedSecrets[hook.id]}
                            />
                            <button
                              type="button"
                              className="rounded-full border px-3 py-1 text-xs"
                              onClick={() => handleCopy(revealedSecrets[hook.id])}
                            >
                              Copy
                            </button>
                          </div>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={webhookLoading === hook.id}
                          onClick={() => rotateWebhook(hook.id)}
                          className="rounded-full border px-3 py-1 text-xs"
                        >
                          {webhookLoading === hook.id ? 'Working…' : 'Rotate secret'}
                        </button>
                        <button
                          type="button"
                          disabled={webhookLoading === hook.id}
                          onClick={() => removeWebhook(hook.id)}
                          className="rounded-full border px-3 py-1 text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex flex-wrap items-end gap-2">
                <label className="block flex-1 text-sm">
                  Name <span className="text-[var(--sea-ink-soft)]">(optional)</span>
                  <input
                    type="text"
                    className="demo-input mt-1 w-full"
                    value={webhookName}
                    onChange={(e) => setWebhookName(e.target.value)}
                    placeholder="TradingView, Discord bot, etc."
                  />
                </label>
                <button
                  type="button"
                  disabled={webhookLoading === 'create'}
                  onClick={createWebhook}
                  className="btn-secondary text-sm"
                >
                  {webhookLoading === 'create' ? 'Creating…' : 'Create webhook'}
                </button>
              </div>
              {copyFeedback && <p className="text-xs text-[var(--sea-ink-soft)]">{copyFeedback}</p>}
            </div>
          </div>
        </div>
      )}
      <p className="text-xs text-[var(--sea-ink-soft)]">
        Need help? See <Link to="/integrations/ninjatrader">NinjaTrader setup</Link> or{' '}
        <Link to="/integrations">all integrations</Link>.
      </p>
    </main>
  )
}
