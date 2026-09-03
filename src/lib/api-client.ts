import type { Review } from '#/lib/review-types'
import type { TestOrderResult, UserSettings } from '#/lib/sizing-types'
import { authClient } from '#/lib/auth-client'
import { apiErrorMessage } from '#/lib/api-error'

const API_BASE = import.meta.env.VITE_RECEIVER_API_URL || 'http://localhost:8000'

export type BillingStatus = {
  status: string
  plan_name: string
  renews_at: string | null
  ends_at: string | null
  can_process_trades: boolean
}

export type Trade = {
  id: string
  broker: string
  mode: string
  status: string
  underlying: string
  option_type: string
  strike: number
  expiration: string
  quantity: number
  fill_price: number | null
  pnl: number | null
  created_at: string
}

export type AlertOutcome = 'executed' | 'skipped' | 'pending'

export type IngestSource = 'desktop' | 'webhook'

export type AlertAudit = {
  id: string
  created_at: string
  ingest_source: IngestSource
  webhook_id: string | null
  webhook_name: string | null
  source_ip: string | null
  source_app: string
  platform: string
  title: string
  text: string
  outcome: AlertOutcome
  skip_reason: string | null
  trade_id: string | null
  trade_status: string | null
  raw_payload: string
}

export type TradierEnvironment = 'sandbox' | 'live'

export type BrokerConnection = {
  broker: string
  status: string
  account_id: string | null
  environment: string | null
  forward_url?: string | null
}

export type InboundWebhook = {
  id: string
  name: string
  enabled: boolean
  url: string
  created_at: string
  updated_at: string
}

export type NinjaTraderConnectInput = {
  forward_url: string
  webhook_secret?: string
  account_label?: string
}

export type NinjaTraderConnectResult = {
  broker: string
  status: string
  forward_url: string
}

export type PairedDevice = {
  device_id: string
  device_token: string
  ws_url: string
  name: string
}

export type UserDevice = {
  id: string
  name: string
  online: boolean
  last_seen_at: string | null
  created_at: string
  revoked: boolean
}

export type TestOrderRequest = {
  symbol?: string
  quantity?: number
  side?: string
  action?: string
  dry_run?: boolean
}

export type AdminAiEvaluation = {
  id: string
  created_at: string
  user_id: string
  user_email: string
  alert_id: string | null
  kind: string
  decision: string
  rationale: string | null
  model: string | null
  prompt_tokens: number | null
  completion_tokens: number | null
  total_tokens: number | null
  cost_usd: number | null
  latency_ms: number | null
  generation_id?: string | null
  output_json?: string | null
}

export type AdminOverview = {
  user_count: number
  active_subscription_count: number
  alerts_today: number
  ai_calls_today: number
  tokens_today: number
  tokens_mtd: number
  cost_usd_today: number
  cost_usd_mtd: number
  latest_evaluations: AdminAiEvaluation[]
}

export type AdminAiEvaluationPage = {
  items: AdminAiEvaluation[]
  total: number
  cost_usd_sum: number
  limit: number
  offset: number
}

export type AdminAiEvaluationParams = {
  kind?: string
  decision?: string
  email?: string
  from?: string
  to?: string
  limit?: number
  offset?: number
}

export type AdminUser = {
  id: string
  email: string
  name: string | null
  created_at: string
  plan_name: string
  status: string
  can_process_trades: boolean
  role: string
}

export type AdminAlertParams = {
  email?: string
  outcome?: string
  from?: string
  to?: string
  limit?: number
}

export type AdminAlertAudit = {
  id: string
  created_at: string
  source: 'ingest' | 'webhook'
  user_id?: string | null
  user_email?: string | null
  outcome: AlertOutcome
  skip_reason: string | null
  payload?: unknown
  text?: string
  title?: string
}

export const DEFAULT_NINJATRADER_TEST_ORDER: TestOrderRequest = {
  symbol: 'ES1!',
  quantity: 1,
  action: 'BUY',
  dry_run: true,
}

let cachedToken: string | null = null
let cachedTokenExpiresAt = 0

async function getReceiverToken(): Promise<string> {
  const now = Date.now()
  if (cachedToken && now < cachedTokenExpiresAt) {
    return cachedToken
  }
  const { data, error } = await authClient.token()
  if (error || !data?.token) {
    cachedToken = null
    cachedTokenExpiresAt = 0
    throw new Error('Not authenticated')
  }
  cachedToken = data.token
  cachedTokenExpiresAt = now + 55 * 60 * 1000
  return cachedToken
}

export function clearReceiverTokenCache() {
  cachedToken = null
  cachedTokenExpiresAt = 0
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getReceiverToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...(init?.headers as Record<string, string>),
  }
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(apiErrorMessage(text, res.statusText))
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export const api = {
  me: () =>
    apiFetch<{
      id: string
      email: string
      can_process_trades: boolean
      onboarding_completed: boolean
      role: string
    }>('/v1/me'),
  billing: () => apiFetch<BillingStatus>('/v1/me/billing'),
  brokers: () => apiFetch<BrokerConnection[]>('/v1/me/brokers'),
  tradierAuthorize: (environment: TradierEnvironment = 'sandbox') =>
    apiFetch<{ url: string }>(`/v1/me/brokers/tradier/authorize?environment=${environment}`),
  tradierConnectToken: (body: {
    access_token: string
    account_id?: string
    environment: TradierEnvironment
  }) =>
    apiFetch<{
      broker: string
      status: string
      account_id: string | null
      environment: TradierEnvironment
    }>('/v1/me/brokers/tradier/token', { method: 'POST', body: JSON.stringify(body) }),
  schwabAuthorize: () => apiFetch<{ url: string }>('/v1/me/brokers/schwab/authorize'),
  ninjatraderConnect: (body: NinjaTraderConnectInput) =>
    apiFetch<NinjaTraderConnectResult>('/v1/me/brokers/ninjatrader/connect', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  pairDevice: (body: { name?: string } = {}) =>
    apiFetch<PairedDevice>('/v1/me/devices/pair', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  devices: () => apiFetch<UserDevice[]>('/v1/me/devices'),
  revokeDevice: (id: string) =>
    apiFetch<{ status: string; device_id: string }>(
      `/v1/me/devices/${encodeURIComponent(id)}`,
      { method: 'DELETE' },
    ),
  webhooks: () => apiFetch<InboundWebhook[]>('/v1/me/webhooks'),
  webhook: (id: string) =>
    apiFetch<InboundWebhook>(`/v1/me/webhooks/${encodeURIComponent(id)}`),
  createWebhook: (body: { name?: string } = {}) =>
    apiFetch<InboundWebhook>('/v1/me/webhooks', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  deleteWebhook: (id: string) =>
    apiFetch<void>(`/v1/me/webhooks/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  disconnectBroker: (broker: string) =>
    apiFetch(`/v1/me/brokers/${broker}`, { method: 'DELETE' }),
  trades: (options?: { mode?: string; month?: string; limit?: number }) => {
    const params = new URLSearchParams()
    if (options?.mode) params.set('mode', options.mode)
    if (options?.month) params.set('month', options.month)
    if (options?.limit != null) params.set('limit', String(options.limit))
    const qs = params.toString()
    return apiFetch<Trade[]>(`/v1/me/trades${qs ? `?${qs}` : ''}`)
  },
  trade: (id: string) => apiFetch<Trade>(`/v1/me/trades/${encodeURIComponent(id)}`),
  alerts: (limit = 100) => apiFetch<AlertAudit[]>(`/v1/me/alerts?limit=${limit}`),
  dailyPnl: (month: string) => apiFetch<Record<string, number>>(`/v1/me/performance/daily?month=${month}`),
  summary: () =>
    apiFetch<{ total_trades: number; total_pnl: number; mtd_pnl: number; win_rate: number }>(
      '/v1/me/performance/summary',
    ),
  settings: () => apiFetch<UserSettings>('/v1/me/settings'),
  updateSettings: (body: UserSettings) =>
    apiFetch<UserSettings>('/v1/me/settings', { method: 'PUT', body: JSON.stringify(body) }),
  testBrokerOrder: (broker: string, body: TestOrderRequest = { symbol: 'SPY', quantity: 1, side: 'buy' }) =>
    apiFetch<TestOrderResult>(`/v1/me/brokers/${broker}/test-order`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  completeOnboarding: () => apiFetch<{ status: string }>('/v1/me/onboarding/complete', { method: 'POST' }),
  regenerateApiKey: () =>
    apiFetch<{ id: string; email: string; api_key: string | null; onboarding_completed: boolean }>(
      '/v1/me/regenerate-api-key',
      { method: 'POST' },
    ),
  setDefaultBroker: (broker: string) =>
    apiFetch<{ default_broker: string }>('/v1/me/brokers/default', {
      method: 'PUT',
      body: JSON.stringify({ broker }),
    }),
  reviews: (limit = 20) => apiFetch<Review[]>(`/v1/reviews?limit=${limit}`),
  myReview: () => apiFetch<Review | null>('/v1/me/review'),
  submitReview: (body: { rating: number; body: string }) =>
    apiFetch<Review>('/v1/me/reviews', { method: 'POST', body: JSON.stringify(body) }),

  adminOverview: () => apiFetch<AdminOverview>('/v1/admin/overview'),
  adminAiEvaluations: (params?: AdminAiEvaluationParams) => {
    const qs = new URLSearchParams()
    if (params?.kind) qs.set('kind', params.kind)
    if (params?.decision) qs.set('decision', params.decision)
    if (params?.email) qs.set('email', params.email)
    if (params?.from) qs.set('from', params.from)
    if (params?.to) qs.set('to', params.to)
    if (params?.limit != null) qs.set('limit', String(params.limit))
    if (params?.offset != null) qs.set('offset', String(params.offset))
    const query = qs.toString()
    return apiFetch<AdminAiEvaluationPage>(`/v1/admin/ai-evaluations${query ? `?${query}` : ''}`)
  },
  adminUsers: (email?: string) => {
    const qs = email ? `?email=${encodeURIComponent(email)}` : ''
    return apiFetch<AdminUser[]>(`/v1/admin/users${qs}`)
  },
  adminUpdateSubscription: (userId: string, body: { status: string; plan_name: string }) =>
    apiFetch<{ user_id: string; status: string; plan_name: string; can_process_trades: boolean }>(
      `/v1/admin/users/${encodeURIComponent(userId)}/subscription`,
      { method: 'POST', body: JSON.stringify(body) },
    ),
  adminUpdateRole: (userId: string, body: { role: 'user' | 'admin' }) =>
    apiFetch<{ user_id: string; role: string }>(
      `/v1/admin/users/${encodeURIComponent(userId)}/role`,
      { method: 'POST', body: JSON.stringify(body) },
    ),
  adminAlerts: (params?: AdminAlertParams) => {
    const qs = new URLSearchParams()
    if (params?.email) qs.set('email', params.email)
    if (params?.outcome) qs.set('outcome', params.outcome)
    if (params?.from) qs.set('from', params.from)
    if (params?.to) qs.set('to', params.to)
    if (params?.limit != null) qs.set('limit', String(params.limit))
    const query = qs.toString()
    return apiFetch<AdminAlertAudit[]>(`/v1/admin/alerts${query ? `?${query}` : ''}`)
  },
}
