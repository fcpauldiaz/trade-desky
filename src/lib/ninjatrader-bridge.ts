import { SITE_URL } from '#/lib/site'

/** Local Windows adapter: NT8 add-on + Python webhook receiver */
export const NINJATRADER_BRIDGE_NAME = 'Trade Desky NinjaTrader'
export const NINJATRADER_BRIDGE_REPO = 'fcpauldiaz/trade-desky-ninjatrader'
export const NINJATRADER_BRIDGE_GITHUB_URL =
  'https://github.com/fcpauldiaz/trade-desky-ninjatrader'
/** Full source zip (receiver + NT8 add-on). */
export const NINJATRADER_BRIDGE_ZIP_URL =
  'https://github.com/fcpauldiaz/trade-desky-ninjatrader/archive/refs/heads/main.zip'
export const NINJATRADER_BRIDGE_README_URL =
  'https://github.com/fcpauldiaz/trade-desky-ninjatrader#readme'
export const NINJATRADER_BRIDGE_GUIDE_PATH = '/integrations/ninjatrader' as const
export const NINJATRADER_BRIDGE_DOWNLOAD_PATH = '/download' as const
export const NINJATRADER_BRIDGE_DOWNLOAD_URL = `${SITE_URL}${NINJATRADER_BRIDGE_DOWNLOAD_PATH}#ninjatrader`
