import { describe, expect, it } from 'vitest'

import {
  NINJATRADER_BRIDGE_APPCAST_PATH,
  NINJATRADER_BRIDGE_GUIDE_PATH,
  NINJATRADER_BRIDGE_WIN_ASSET_PATH,
  NINJATRADER_BRIDGE_ZIP_PATH,
} from '#/lib/ninjatrader-bridge'

describe('ninjatrader-bridge', () => {
  it('exposes hosted desktop assets and on-site guide paths', () => {
    expect(NINJATRADER_BRIDGE_WIN_ASSET_PATH).toBe(
      '/desktop/TradeDeskyNinjaTraderReceiver-setup.exe',
    )
    expect(NINJATRADER_BRIDGE_ZIP_PATH).toBe('/desktop/TradeDeskyNinjaTraderReceiver-win.zip')
    expect(NINJATRADER_BRIDGE_APPCAST_PATH).toBe(
      '/desktop/TradeDeskyNinjaTraderReceiver-appcast.xml',
    )
    expect(NINJATRADER_BRIDGE_GUIDE_PATH).toBe('/guides/ninjatrader')

    const urls = [
      NINJATRADER_BRIDGE_WIN_ASSET_PATH,
      NINJATRADER_BRIDGE_ZIP_PATH,
      NINJATRADER_BRIDGE_APPCAST_PATH,
    ]
    for (const url of urls) {
      expect(url.startsWith('/desktop/')).toBe(true)
      expect(url.includes('github.com')).toBe(false)
    }
  })
})
