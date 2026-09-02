import { describe, expect, it } from 'vitest'

import { baseDeviceWsUrl, normalizePairedDevice } from '#/lib/device-pairing'

describe('baseDeviceWsUrl', () => {
  it('returns the URL unchanged when no token query param is present', () => {
    expect(baseDeviceWsUrl('wss://api.example.com/v1/devices/ws')).toBe(
      'wss://api.example.com/v1/devices/ws',
    )
  })

  it('strips a token query param from the WebSocket URL', () => {
    expect(
      baseDeviceWsUrl('wss://api.example.com/v1/devices/ws?token=ntd_secret_token'),
    ).toBe('wss://api.example.com/v1/devices/ws')
  })

  it('keeps other query params when removing token', () => {
    expect(
      baseDeviceWsUrl('wss://api.example.com/v1/devices/ws?region=us&token=ntd_secret_token'),
    ).toBe('wss://api.example.com/v1/devices/ws?region=us')
  })
})

describe('normalizePairedDevice', () => {
  it('normalizes ws_url while preserving other pairing fields', () => {
    expect(
      normalizePairedDevice({
        device_id: 'dev_123',
        device_token: 'ntd_secret_token',
        ws_url: 'wss://api.example.com/v1/devices/ws?token=ntd_secret_token',
        name: 'Office PC',
      }),
    ).toEqual({
      device_id: 'dev_123',
      device_token: 'ntd_secret_token',
      ws_url: 'wss://api.example.com/v1/devices/ws',
      name: 'Office PC',
    })
  })
})
