import type { Review } from '#/lib/review-types'
import type { TestOrderResult, UserSettings } from '#/lib/sizing-types'
import { authClient } from '#/lib/auth-client'

const API_BASE = import.meta.env.VITE_RECEIVER_API_URL || 'http://localhost:8000'

export type BillingStatus = {
  status: string
  plan_name: string
  renews_at: string | null
  ends_at: string | null
  can_process_trades: boolean
  customer_portal_url: string | null
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

export type TradierEnvironment = 'sandbox' | 'live'

export type BrokerConnection = {
  broker: string
  status: string
  account_id: string | null
  environment: string | null
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

function apiErrorMessage(text: string, fallback: string): string {
  if (!text) return fallback
  try {
    const body = JSON.parse(text) as { detail?: unknown }
    if (typeof body.detail === 'string' && body.detail) return body.detail
  } catch {
    return text
  }
  return text
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
    }>('/v1/me'),
  billing: () => apiFetch<BillingStatus>('/v1/me/billing'),
  createCheckout: () =>
    apiFetch<{ checkout_url: string; checkout_id: string | null }>('/v1/me/billing/checkout', {
      method: 'POST',
    }),
  createBillingPortal: () => apiFetch<{ url: string }>('/v1/me/billing/portal', { method: 'POST' }),
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
  disconnectBroker: (broker: string) =>
    apiFetch(`/v1/me/brokers/${broker}`, { method: 'DELETE' }),
  trades: (mode?: string) => apiFetch<Trade[]>(`/v1/me/trades${mode ? `?mode=${mode}` : ''}`),
  dailyPnl: (month: string) => apiFetch<Record<string, number>>(`/v1/me/performance/daily?month=${month}`),
  summary: () =>
    apiFetch<{ total_trades: number; total_pnl: number; mtd_pnl: number; win_rate: number }>(
      '/v1/me/performance/summary',
    ),
  settings: () => apiFetch<UserSettings>('/v1/me/settings'),
  updateSettings: (body: UserSettings) =>
    apiFetch<UserSettings>('/v1/me/settings', { method: 'PUT', body: JSON.stringify(body) }),
  testBrokerOrder: (broker: string) =>
    apiFetch<TestOrderResult>(`/v1/me/brokers/${broker}/test-order`, {
      method: 'POST',
      body: JSON.stringify({ symbol: 'SPY', quantity: 1, side: 'buy' }),
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
}
