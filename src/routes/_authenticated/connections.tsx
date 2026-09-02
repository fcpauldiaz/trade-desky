import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react'
import {
  api,
  DEFAULT_NINJATRADER_TEST_ORDER,
  type BrokerConnection,
  type InboundWebhook,
  type TradierEnvironment,
} from '#/lib/api-client'
import CreateWebhookForm from '#/components/connections/CreateWebhookForm'
import NinjatraderConnectForm from '#/components/connections/NinjatraderConnectForm'
import TradierTokenForm from '#/components/connections/TradierTokenForm'
import FieldHelpDialog from '#/components/FieldHelpDialog'
import UpgradeBanner from '#/components/UpgradeBanner'
import { NINJATRADER_GUIDE_PATH } from '#/lib/guides'

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
  const [testMsg, setTestMsg] = useState<Record<string, { message: string; success: boolean }>>({})
  const [testing, setTesting] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [tradierEnvironment, setTradierEnvironment] = useState<TradierEnvironment>('sandbox')
  const [ninjatraderForwardUrl, setNinjatraderForwardUrl] = useState('')
  const [ninjatraderAccountLabel, setNinjatraderAccountLabel] = useState('')
  const [webhooks, setWebhooks] = useState<InboundWebhook[]>([])
  const [revealedSecrets, setRevealedSecrets] = useState<Record<string, string>>({})
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
      setNinjatraderAccountLabel(connectedNt.account_id)
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

  async function connectTradierToken(values: {
    environment: TradierEnvironment
    accessToken: string
    accountId: string
  }) {
    setError('')
    try {
      await api.tradierConnectToken({
        access_token: values.accessToken.trim(),
        account_id: values.accountId.trim() || undefined,
        environment: values.environment,
      })
      await refreshBrokers()
      if (!tradierConnected) {
        navigate({ to: '/dashboard' })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tradier token connect failed')
      throw err
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

  async function connectNinjatrader(values: {
    forwardUrl: string
    bridgeWebhookSecret: string
    accountLabel: string
  }) {
    setError('')
    try {
      const result = await api.ninjatraderConnect({
        forward_url: values.forwardUrl.trim(),
        webhook_secret: values.bridgeWebhookSecret.trim() || undefined,
        account_label: values.accountLabel.trim() || undefined,
      })
      setNinjatraderForwardUrl(result.forward_url)
      await refreshBrokers()
      return { forwardUrl: result.forward_url }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'NinjaTrader connect failed')
      throw err
    }
  }

  async function testConnection(broker: string): Promise<{ success: boolean; message: string }> {
    setTesting(broker)
    try {
      const res =
        broker === 'ninjatrader'
          ? await api.testBrokerOrder(broker, DEFAULT_NINJATRADER_TEST_ORDER)
          : await api.testBrokerOrder(broker)
      const result = { success: res.success, message: res.message }
      setTestMsg((prev) => ({ ...prev, [broker]: result }))
      return result
    } catch (e) {
      const result = {
        success: false,
        message: e instanceof Error ? e.message : 'Test failed',
      }
      setTestMsg((prev) => ({ ...prev, [broker]: result }))
      return result
    } finally {
      setTesting(null)
    }
  }

  const ninjatraderTestDisabled = !ninjatraderConnected || !canTrade
  const ninjatraderTestDisabledReason = !canTrade
    ? 'An active subscription is required to test broker connections.'
    : !ninjatraderConnected
      ? 'Connect NinjaTrader before running a test order.'
      : undefined

  async function setDefault(broker: string) {
    await api.setDefaultBroker(broker)
    setDefaultBroker(broker)
  }

  async function disconnect(broker: string) {
    await api.disconnectBroker(broker)
    if (broker === 'ninjatrader') {
      setNinjatraderForwardUrl('')
      setNinjatraderAccountLabel('')
    }
    await refreshBrokers()
  }

  async function createWebhook(values: { name: string }) {
    setError('')
    setWebhookLoading('create')
    try {
      const created = await api.createWebhook({ name: values.name.trim() })
      setRevealedSecrets((prev) => ({ ...prev, [created.id]: created.secret }))
      await refreshWebhooks()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create webhook')
      throw e
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
            {testMsg[b.broker] && (
              <p
                className={`mt-2 text-xs ${testMsg[b.broker].success ? 'text-green-700' : 'text-red-600'}`}
              >
                {testMsg[b.broker].message}
              </p>
            )}
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
            <TradierTokenForm
              connected={tradierConnected}
              environment={tradierEnvironment}
              onEnvironmentChange={setTradierEnvironment}
              onSubmit={connectTradierToken}
            />
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
                Futures execution via a local bridge.{' '}
                <Link className="underline" to={NINJATRADER_GUIDE_PATH}>
                  Setup guide
                </Link>
                {' · '}
                <Link className="underline" to="/download#ninjatrader">
                  Download bridge
                </Link>
                . Pick your account in the NinjaTrader panel, then paste the bridge HTTPS webhook URL below.
              </p>
            </div>
            <NinjatraderConnectForm
              connected={ninjatraderConnected}
              initialForwardUrl={ninjatraderForwardUrl}
              initialAccountLabel={ninjatraderAccountLabel}
              onSubmit={connectNinjatrader}
              onTestConnection={() => testConnection('ninjatrader')}
              testDisabled={ninjatraderTestDisabled}
              testDisabledReason={ninjatraderTestDisabledReason}
              testLoading={testing === 'ninjatrader'}
              testResult={testMsg.ninjatrader ?? null}
            />
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
                        <FieldHelpDialog title="Inbound webhook URL" triggerLabel="What is this URL?">
                          <p>
                            This is Trade Desky&apos;s cloud endpoint for external systems (TradingView,
                            Discord bots, custom scripts) to <strong>POST JSON</strong> alerts.
                          </p>
                          <p>
                            Include your webhook secret in the{' '}
                            <code>X-Webhook-Secret</code> request header. Trade Desky parses the payload
                            with AI and routes futures to NinjaTrader when it is your default broker.
                          </p>
                        </FieldHelpDialog>
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
              <CreateWebhookForm loading={webhookLoading === 'create'} onSubmit={createWebhook} />
              {copyFeedback && <p className="text-xs text-[var(--sea-ink-soft)]">{copyFeedback}</p>}
            </div>
          </div>
        </div>
      )}
      <p className="text-xs text-[var(--sea-ink-soft)]">
        Need help? See <Link to={NINJATRADER_GUIDE_PATH}>NinjaTrader setup guide</Link> or{' '}
        <Link to="/integrations">all integrations</Link>.
      </p>
    </main>
  )
}
