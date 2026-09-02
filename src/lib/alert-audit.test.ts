import { describe, expect, it } from 'vitest'

import type { AlertAudit } from '#/lib/api-client'
import {
  alertCounts,
  alertLocalDayKey,
  currentDateKey,
  filterAlerts,
  filterAlertsByDateRange,
  filterAlertsByIngestSource,
  formatAlertOutcome,
  formatAlertSourceLabel,
  formatPlatform,
  formatSourceApp,
  formatWebhookLabel,
  ingestSourceCounts,
  resolveIngestSource,
} from '#/lib/alert-audit'

function alert(partial: Partial<AlertAudit>): AlertAudit {
  return {
    id: '1',
    created_at: '2026-08-16T12:00:00Z',
    ingest_source: 'desktop',
    webhook_id: null,
    webhook_name: null,
    source_ip: null,
    source_app: 'com.hnc.Discord',
    platform: 'macos',
    title: 'Alerts',
    text: 'BTO SPY',
    outcome: 'skipped',
    skip_reason: 'no broker connected',
    trade_id: null,
    trade_status: null,
    raw_payload: '{"title":"Alerts","body":"BTO SPY"}',
    ...partial,
  }
}

function localIso(year: number, month: number, day: number, hour = 12): string {
  return new Date(year, month - 1, day, hour).toISOString()
}

describe('filterAlertsByDateRange', () => {
  const rows = [
    alert({ id: 'a', created_at: localIso(2026, 8, 16) }),
    alert({ id: 'b', created_at: localIso(2026, 8, 17) }),
    alert({ id: 'c', created_at: localIso(2026, 8, 18) }),
  ]

  it('keeps alerts within the inclusive range', () => {
    expect(filterAlertsByDateRange(rows, '2026-08-16', '2026-08-17').map((row) => row.id)).toEqual([
      'a',
      'b',
    ])
  })

  it('filters to a single day', () => {
    expect(filterAlertsByDateRange(rows, '2026-08-17', '2026-08-17').map((row) => row.id)).toEqual(['b'])
  })
})

describe('currentDateKey', () => {
  it('formats local calendar day', () => {
    expect(currentDateKey(new Date(2026, 7, 16))).toBe('2026-08-16')
  })
})

describe('alertLocalDayKey', () => {
  it('uses the local calendar day', () => {
    expect(alertLocalDayKey(localIso(2026, 8, 16, 15))).toBe('2026-08-16')
  })
})

describe('filterAlerts', () => {
  const rows = [
    alert({ id: 'a', outcome: 'executed' }),
    alert({ id: 'b', outcome: 'skipped' }),
    alert({ id: 'c', outcome: 'pending' }),
  ]

  it('returns every row for all', () => {
    expect(filterAlerts(rows, 'all')).toHaveLength(3)
  })

  it('keeps a single outcome', () => {
    expect(filterAlerts(rows, 'skipped').map((row) => row.id)).toEqual(['b'])
  })
})

describe('alertCounts', () => {
  it('counts each outcome', () => {
    expect(
      alertCounts([
        alert({ outcome: 'executed' }),
        alert({ outcome: 'executed' }),
        alert({ outcome: 'skipped' }),
      ]),
    ).toEqual({ all: 3, executed: 2, skipped: 1, pending: 0 })
  })
})

describe('formatSourceApp', () => {
  it('uses the last bundle segment', () => {
    expect(formatSourceApp('com.hnc.Discord')).toBe('Discord')
  })

  it('falls back when empty', () => {
    expect(formatSourceApp('')).toBe('Unknown')
  })
})

describe('formatAlertOutcome', () => {
  it('labels outcomes', () => {
    expect(formatAlertOutcome('executed')).toBe('Executed')
    expect(formatAlertOutcome('skipped')).toBe('Skipped')
    expect(formatAlertOutcome('pending')).toBe('Pending')
  })
})

describe('formatPlatform', () => {
  it('pretty-prints known platforms', () => {
    expect(formatPlatform('macos')).toBe('macOS')
    expect(formatPlatform('windows')).toBe('Windows')
    expect(formatPlatform('')).toBe('—')
  })
})

describe('filterAlertsByIngestSource', () => {
  const rows = [
    alert({ id: 'a', ingest_source: 'desktop' }),
    alert({ id: 'b', ingest_source: 'webhook', webhook_name: 'TradingView' }),
  ]

  it('keeps all sources', () => {
    expect(filterAlertsByIngestSource(rows, 'all')).toHaveLength(2)
  })

  it('filters webhook ingests', () => {
    expect(filterAlertsByIngestSource(rows, 'webhook').map((row) => row.id)).toEqual(['b'])
  })
})

describe('ingestSourceCounts', () => {
  it('counts desktop and webhook rows', () => {
    expect(
      ingestSourceCounts([
        alert({ ingest_source: 'desktop' }),
        alert({ ingest_source: 'webhook' }),
        alert({ ingest_source: 'webhook' }),
      ]),
    ).toEqual({ all: 3, desktop: 1, webhook: 2 })
  })
})

describe('formatWebhookLabel', () => {
  it('prefers webhook name', () => {
    expect(formatWebhookLabel(alert({ webhook_name: 'TradingView', webhook_id: 'wh_123' }))).toBe(
      'TradingView',
    )
  })

  it('falls back to short id', () => {
    expect(formatWebhookLabel(alert({ webhook_id: 'wh_abcdef12' }))).toBe('Webhook wh_abcde')
  })
})

describe('formatAlertSourceLabel', () => {
  it('labels webhook and desktop sources', () => {
    expect(formatAlertSourceLabel(alert({ ingest_source: 'webhook', webhook_name: 'TV' }))).toBe('TV')
    expect(formatAlertSourceLabel(alert({ ingest_source: 'desktop', source_app: 'com.hnc.Discord' }))).toBe(
      'Discord',
    )
  })
})

describe('resolveIngestSource', () => {
  it('defaults missing ingest_source to desktop', () => {
    const row = alert({ ingest_source: undefined as unknown as AlertAudit['ingest_source'] })
    expect(resolveIngestSource(row)).toBe('desktop')
  })
})
