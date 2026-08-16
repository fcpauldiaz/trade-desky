import { describe, expect, it } from 'vitest'

import {
  DESKTOP_APP_DOWNLOAD_PATH,
  DESKTOP_APP_DOWNLOAD_URL,
  DESKTOP_APPCAST_PATH,
  DESKTOP_MAC_ASSET_PATH,
  DESKTOP_WIN_ASSET_PATH,
} from '#/lib/desktop-app'
import { SITE_URL } from '#/lib/site'

describe('desktop download URLs', () => {
  it('stays on the Trade Desky site instead of GitHub', () => {
    expect(DESKTOP_APP_DOWNLOAD_PATH).toBe('/download')
    expect(DESKTOP_APP_DOWNLOAD_URL).toBe(`${SITE_URL}/download`)
    expect(DESKTOP_MAC_ASSET_PATH).toBe('/desktop/TradeDeskyWatcher.dmg')
    expect(DESKTOP_WIN_ASSET_PATH).toBe('/desktop/TradeDeskyWatcher-setup.exe')
    expect(DESKTOP_APPCAST_PATH).toBe('/desktop/appcast.xml')
    const urls = [
      DESKTOP_APP_DOWNLOAD_URL,
      DESKTOP_MAC_ASSET_PATH,
      DESKTOP_WIN_ASSET_PATH,
      DESKTOP_APPCAST_PATH,
    ]
    for (const url of urls) {
      expect(url.includes('github.com')).toBe(false)
    }
  })
})
