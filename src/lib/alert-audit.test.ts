import { describe, expect, it } from 'vitest'

import type { AlertAudit } from '#/lib/api-client'
import {
  alertCounts,
  filterAlerts,
  formatAlertOutcome,
  formatPlatform,
  formatSourceApp,
} from '#/lib/alert-audit'

function alert(partial: Partial<AlertAudit>): AlertAudit {
  return {
    id: '1',
    created_at: '2026-08-16T12:00:00Z',
    source_app: 'com.hnc.Discord',
    platform: 'macos',
    title: 'Alerts',
    text: 'BTO SPY',
    outcome: 'skipped',
    skip_reason: 'no broker connected',
    trade_id: null,
    trade_status: null,
    ...partial,
  }
}

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
