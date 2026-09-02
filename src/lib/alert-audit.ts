import type { AlertAudit, AlertOutcome, IngestSource } from '#/lib/api-client'

export type AlertFilter = AlertOutcome | 'all'
export type IngestSourceFilter = IngestSource | 'all'

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

export function filterAlertsByIngestSource(
  alerts: AlertAudit[],
  source: IngestSourceFilter,
): AlertAudit[] {
  if (source === 'all') return alerts
  return alerts.filter((alert) => resolveIngestSource(alert) === source)
}

export function ingestSourceCounts(alerts: AlertAudit[]): Record<IngestSourceFilter, number> {
  return {
    all: alerts.length,
    desktop: alerts.filter((alert) => resolveIngestSource(alert) === 'desktop').length,
    webhook: alerts.filter((alert) => resolveIngestSource(alert) === 'webhook').length,
  }
}

export function resolveIngestSource(alert: AlertAudit): IngestSource {
  return alert.ingest_source ?? 'desktop'
}

export function formatIngestSource(source: IngestSource): string {
  return source === 'webhook' ? 'Webhook' : 'Desktop'
}

export function formatWebhookLabel(alert: AlertAudit): string {
  if (alert.webhook_name?.trim()) return alert.webhook_name.trim()
  if (alert.webhook_id) return `Webhook ${alert.webhook_id.slice(0, 8)}`
  return 'Webhook'
}

export function formatAlertSourceLabel(alert: AlertAudit): string {
  if (resolveIngestSource(alert) === 'webhook') {
    return formatWebhookLabel(alert)
  }
  return formatSourceApp(alert.source_app)
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
