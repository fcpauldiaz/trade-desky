import { describe, expect, it } from 'vitest'

import { formatSignedUsd, pnlCaption, pnlShareFilename } from '#/lib/share-pnl'

describe('formatSignedUsd', () => {
  it('prefixes gains', () => {
    expect(formatSignedUsd(1240)).toBe('+$1,240.00')
  })

  it('prefixes losses without a double minus', () => {
    expect(formatSignedUsd(-12.5)).toBe('-$12.50')
  })

  it('leaves zero unsigned', () => {
    expect(formatSignedUsd(0)).toBe('$0.00')
  })
})

describe('pnlCaption', () => {
  it('builds a month caption', () => {
    expect(pnlCaption('month', '2026-08', 1240)).toBe('August 2026 · +$1,240.00 · Trade Desky')
  })

  it('builds a day caption', () => {
    expect(pnlCaption('day', '2026-08-15', -80)).toBe('Sat, Aug 15, 2026 · -$80.00 · Trade Desky')
  })
})

describe('pnlShareFilename', () => {
  it('uses the month or day key', () => {
    expect(pnlShareFilename('month', '2026-08')).toBe('trade-desky-pnl-2026-08.png')
    expect(pnlShareFilename('day', '2026-08-15')).toBe('trade-desky-pnl-2026-08-15.png')
  })
})
