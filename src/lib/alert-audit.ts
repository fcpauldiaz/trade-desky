import type { AlertAudit, AlertOutcome } from '#/lib/api-client'

export type AlertFilter = AlertOutcome | 'all'

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
