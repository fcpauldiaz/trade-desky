import { describe, expect, it } from 'vitest'

import {
  NINJATRADER_BRIDGE_APPCAST_PATH,
  NINJATRADER_BRIDGE_GUIDE_PATH,
  NINJATRADER_BRIDGE_WIN_ASSET_PATH,
  NINJATRADER_BRIDGE_ZIP_PATH,
} from '#/lib/ninjatrader-bridge'

const RECEIVER_DESKTOP_BASE = 'https://trade-receiver.chapilabs.com/desktop'

describe('ninjatrader-bridge', () => {
  it('exposes trade-receiver desktop assets and on-site guide paths', () => {
    expect(NINJATRADER_BRIDGE_WIN_ASSET_PATH).toBe(
      `${RECEIVER_DESKTOP_BASE}/TradeDeskyNinjaTraderReceiver-setup.exe`,
    )
    expect(NINJATRADER_BRIDGE_ZIP_PATH).toBe(
      `${RECEIVER_DESKTOP_BASE}/TradeDeskyNinjaTraderReceiver-win.zip`,
    )
    expect(NINJATRADER_BRIDGE_APPCAST_PATH).toBe(
      `${RECEIVER_DESKTOP_BASE}/TradeDeskyNinjaTraderReceiver-appcast.xml`,
    )
    expect(NINJATRADER_BRIDGE_GUIDE_PATH).toBe('/guides/ninjatrader')

    const urls = [
      NINJATRADER_BRIDGE_WIN_ASSET_PATH,
      NINJATRADER_BRIDGE_ZIP_PATH,
      NINJATRADER_BRIDGE_APPCAST_PATH,
    ]
    for (const url of urls) {
      expect(url.startsWith(`${RECEIVER_DESKTOP_BASE}/`)).toBe(true)
      expect(url.includes('tradedesky.chapilabs.com')).toBe(false)
      expect(url.includes('github.com')).toBe(false)
    }
  })
})
