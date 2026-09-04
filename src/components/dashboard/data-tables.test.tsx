// @vitest-environment jsdom

import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import TradeTable from '#/components/dashboard/TradeTable'
import AlertAuditTable from '#/components/dashboard/AlertAuditTable'
import type { AlertAudit, Trade } from '#/lib/api-client'

afterEach(() => {
  cleanup()
})

const sampleTrade: Trade = {
  id: 'trade-1',
  broker: 'tradier',
  mode: 'live',
  status: 'filled',
  underlying: 'SPY',
  option_type: 'call',
  strike: 500,
  expiration: '2026-01-17',
  quantity: 2,
  fill_price: 1.25,
  pnl: 42.5,
  created_at: '2026-01-10T15:30:00.000Z',
}

const sampleAlert: AlertAudit = {
  id: 'alert-1',
  created_at: '2026-01-10T15:30:00.000Z',
  title: 'Buy SPY call',
  text: 'Alert body copy for testing.',
  outcome: 'executed',
  skip_reason: null,
  trade_id: null,
  trade_status: null,
  platform: 'windows',
  webhook_id: null,
  webhook_name: null,
  source_ip: null,
  source_app: 'ninjatrader',
  raw_payload: '{"symbol":"SPY"}',
  ingest_source: 'desktop',
}

describe('TradeTable', () => {
  it('renders mobile cards and desktop table regions', () => {
    render(<TradeTable trades={[sampleTrade]} />)

    const mobileList = screen.getByLabelText('Recent trades')
    expect(within(mobileList).getByText('SPY')).toBeTruthy()
    expect(within(mobileList).getByText('42.50')).toBeTruthy()
    expect(document.querySelector('.data-table-scroll table')).toBeTruthy()
  })

  it('shows empty state when there are no trades', () => {
    render(<TradeTable trades={[]} />)
    expect(screen.getByText('No trades yet.')).toBeTruthy()
  })
})

describe('AlertAuditTable', () => {
  it('renders mobile cards and desktop table regions', () => {
    render(<AlertAuditTable alerts={[sampleAlert]} />)

    const mobileList = screen.getByLabelText('Alert audit')
    expect(within(mobileList).getByText('Buy SPY call')).toBeTruthy()
    expect(within(mobileList).getByText('Executed')).toBeTruthy()
    expect(document.querySelector('.data-table-scroll table')).toBeTruthy()
  })

  it('shows filter empty state when alerts are hidden by filters', () => {
    render(<AlertAuditTable alerts={[]} totalCount={3} />)
    expect(screen.getByText('No alerts match the current filters.')).toBeTruthy()
  })
})
