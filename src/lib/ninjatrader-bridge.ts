import { SITE_URL } from '#/lib/site'

/** CI publishes NT bridge installers to trade-receiver, not the marketing site /desktop proxy. */
const RECEIVER_PUBLIC_URL = (
  import.meta.env.VITE_RECEIVER_API_URL || 'https://trade-receiver.chapilabs.com'
).replace(/\/$/, '')

/** Local Windows adapter: NT8 add-on + Python webhook receiver */
export const NINJATRADER_BRIDGE_NAME = 'Trade Desky NinjaTrader'
export const NINJATRADER_BRIDGE_VERSION_LABEL = 'Latest setup'
export const NINJATRADER_BRIDGE_GUIDE_PATH = '/guides/ninjatrader' as const
export const NINJATRADER_BRIDGE_DOWNLOAD_PATH = '/download' as const
export const NINJATRADER_BRIDGE_WIN_ASSET_PATH = `${RECEIVER_PUBLIC_URL}/desktop/TradeDeskyNinjaTraderReceiver-setup.exe`
export const NINJATRADER_BRIDGE_ZIP_PATH = `${RECEIVER_PUBLIC_URL}/desktop/TradeDeskyNinjaTraderReceiver-win.zip`
export const NINJATRADER_BRIDGE_APPCAST_PATH = `${RECEIVER_PUBLIC_URL}/desktop/TradeDeskyNinjaTraderReceiver-appcast.xml`

export const NINJATRADER_BRIDGE_DOWNLOAD_URL = `${SITE_URL}${NINJATRADER_BRIDGE_DOWNLOAD_PATH}#ninjatrader`
