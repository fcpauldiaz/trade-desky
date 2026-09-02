import { describe, expect, it } from 'vitest'

import { DEFAULT_NINJATRADER_TEST_ORDER } from '#/lib/api-client'

describe('DEFAULT_NINJATRADER_TEST_ORDER', () => {
  it('targets futures with a dry-run test order', () => {
    expect(DEFAULT_NINJATRADER_TEST_ORDER).toEqual({
      symbol: 'ES1!',
      quantity: 1,
      action: 'BUY',
      dry_run: true,
    })
  })
})

describe('receiver device paths', () => {
  it('scopes revoke to device id', () => {
    const id = 'dev_abc-123'
    const encoded = encodeURIComponent(id)
    expect(`/v1/me/devices/${encoded}`).toBe('/v1/me/devices/dev_abc-123')
  })
})

describe('receiver webhook paths', () => {
  it('scopes rotate and delete to webhook id', () => {
    const id = 'wh_abc-123'
    const encoded = encodeURIComponent(id)
    expect(`/v1/me/webhooks/${encoded}/rotate-secret`).toBe(
      '/v1/me/webhooks/wh_abc-123/rotate-secret',
    )
    expect(`/v1/me/webhooks/${encoded}`).toBe('/v1/me/webhooks/wh_abc-123')
  })
})
