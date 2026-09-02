export {
  NINJATRADER_BRIDGE_WIN_ASSET_PATH,
  NINJATRADER_BRIDGE_ZIP_PATH,
} from '#/lib/ninjatrader-bridge'

export const NINJATRADER_GUIDE_PATH = '/guides/ninjatrader' as const

/** Bump when guide SVGs change so CDN/browsers drop stale broken bodies. */
export const NINJATRADER_GUIDE_ASSET_VERSION = '2'

export const NINJATRADER_GUIDE_IMAGES = {
  architecture: '/guides/ninjatrader/architecture.svg',
  ntAddon: '/guides/ninjatrader/nt-addon-panel.svg',
  receiver: '/guides/ninjatrader/receiver-terminal.svg',
  tunnel: '/guides/ninjatrader/tunnel.svg',
  connections: '/guides/ninjatrader/connections-ui.svg',
} as const

export function guideAssetUrl(src: string): string {
  const join = src.includes('?') ? '&' : '?'
  return `${src}${join}v=${NINJATRADER_GUIDE_ASSET_VERSION}`
}
