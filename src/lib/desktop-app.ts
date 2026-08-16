import { SITE_URL } from '#/lib/site'

export const DESKTOP_APP_NAME = 'Trade Desky Watcher'
export const DESKTOP_APP_DOWNLOAD_PATH = '/download' as const
export const DESKTOP_MAC_ASSET_PATH = '/desktop/TradeDeskyWatcher.dmg'
export const DESKTOP_WIN_ASSET_PATH = '/desktop/TradeDeskyWatcher-setup.exe'
export const DESKTOP_APPCAST_PATH = '/desktop/appcast.xml'

export const DESKTOP_APP_DOWNLOAD_URL = `${SITE_URL}${DESKTOP_APP_DOWNLOAD_PATH}`
