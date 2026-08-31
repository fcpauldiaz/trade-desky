import type { AlertAudit, AlertOutcome } from '#/lib/api-client'

export type AlertFilter = AlertOutcome | 'all'

export function currentDateKey(now = new Date()): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

export function alertLocalDayKey(createdAt: string): string {
  const date = new Date(createdAt)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function filterAlertsByDateRange(
  alerts: AlertAudit[],
  fromDate: string,
  toDate: string,
): AlertAudit[] {
  if (!fromDate && !toDate) return alerts
  const from = fromDate || toDate
  const to = toDate || fromDate
  return alerts.filter((alert) => {
    const day = alertLocalDayKey(alert.created_at)
    return day >= from && day <= to
  })
}

export function filterAlerts(alerts: AlertAudit[], filter: AlertFilter): AlertAudit[] {
  if (filter === 'all') return alerts
  return alerts.filter((alert) => alert.outcome === filter)
}

export function alertCounts(alerts: AlertAudit[]): Record<AlertFilter, number> {
  return {
    all: alerts.length,
    executed: alerts.filter((alert) => alert.outcome === 'executed').length,
    skipped: alerts.filter((alert) => alert.outcome === 'skipped').length,
    pending: alerts.filter((alert) => alert.outcome === 'pending').length,
  }
}

export function formatAlertOutcome(outcome: AlertOutcome): string {
  if (outcome === 'executed') return 'Executed'
  if (outcome === 'skipped') return 'Skipped'
  return 'Pending'
}

export function formatSourceApp(appId: string): string {
  const trimmed = appId.trim()
  if (!trimmed) return 'Unknown'
  const parts = trimmed.split('.').filter(Boolean)
  return parts[parts.length - 1] ?? trimmed
}

export function formatPlatform(platform: string): string {
  if (platform === 'macos') return 'macOS'
  if (platform === 'windows') return 'Windows'
  if (!platform.trim()) return '—'
  return platform
}
