import { describe, expect, it } from 'vitest'

import {
  currentMonthKey,
  dayKeyFor,
  formatDayLabel,
  formatMonthLabel,
  heatmapMaxAbs,
  monthGrid,
  realizedPnlStats,
  shiftMonth,
  sumDailyPnl,
} from '#/lib/pnl-calendar'

describe('currentMonthKey', () => {
  it('formats local year and month', () => {
    expect(currentMonthKey(new Date(2026, 7, 16))).toBe('2026-08')
  })
})

describe('shiftMonth', () => {
  it('moves backward across years', () => {
    expect(shiftMonth('2026-01', -1)).toBe('2025-12')
  })

  it('moves forward across years', () => {
    expect(shiftMonth('2025-12', 1)).toBe('2026-01')
  })
})

describe('formatMonthLabel', () => {
  it('uses a long month name', () => {
    expect(formatMonthLabel('2026-08')).toBe('August 2026')
  })
})

describe('formatDayLabel', () => {
  it('includes weekday and date', () => {
    expect(formatDayLabel('2026-08-15')).toBe('Sat, Aug 15, 2026')
  })
})

describe('monthGrid', () => {
  it('pads leading days for the weekday of the 1st', () => {
    const cells = monthGrid('2026-08')
    expect(cells[0]).toBeNull()
    expect(cells[6]).toBe(1)
    expect(cells.filter((day) => day !== null)).toHaveLength(31)
  })
})

describe('dayKeyFor', () => {
  it('zero-pads month and day', () => {
    expect(dayKeyFor('2026-08', 5)).toBe('2026-08-05')
  })
})

describe('sumDailyPnl and heatmapMaxAbs', () => {
  it('sums realized days', () => {
    expect(sumDailyPnl({ '2026-08-01': 10.5, '2026-08-02': -2 })).toBe(8.5)
  })

  it('uses at least 1 for empty maps', () => {
    expect(heatmapMaxAbs({})).toBe(1)
  })
})

describe('realizedPnlStats', () => {
  it('counts wins and losses from realized trades', () => {
    expect(
      realizedPnlStats([{ pnl: 20 }, { pnl: -5 }, { pnl: null }, { pnl: 0 }]),
    ).toEqual({ filled: 3, wins: 1, losses: 1, winRate: expect.closeTo(33.333, 2) })
  })
})
