import { SITE_URL } from '#/lib/site'

/** Local Windows adapter: NT8 add-on + Python webhook receiver */
export const NINJATRADER_BRIDGE_NAME = 'Trade Desky NinjaTrader'
export const NINJATRADER_BRIDGE_GUIDE_PATH = '/guides/ninjatrader' as const
export const NINJATRADER_BRIDGE_DOWNLOAD_PATH = '/download' as const
export const NINJATRADER_BRIDGE_WIN_ASSET_PATH =
  '/desktop/TradeDeskyNinjaTraderReceiver-setup.exe'
export const NINJATRADER_BRIDGE_ZIP_PATH = '/desktop/TradeDeskyNinjaTraderReceiver-win.zip'
export const NINJATRADER_BRIDGE_APPCAST_PATH =
  '/desktop/TradeDeskyNinjaTraderReceiver-appcast.xml'

export const NINJATRADER_BRIDGE_DOWNLOAD_URL = `${SITE_URL}${NINJATRADER_BRIDGE_DOWNLOAD_PATH}#ninjatrader`
