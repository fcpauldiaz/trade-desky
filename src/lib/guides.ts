export { NINJATRADER_BRIDGE_ZIP_URL } from '#/lib/ninjatrader-bridge'

export const NINJATRADER_GUIDE_PATH = '/guides/ninjatrader' as const

/** Cache-bust query so CDN does not keep broken pre-fix SVG bodies. */
const GUIDE_ASSET_V = 'v=2'

export const NINJATRADER_GUIDE_IMAGES = {
  architecture: `/guides/ninjatrader/architecture.svg?${GUIDE_ASSET_V}`,
  ntAddon: `/guides/ninjatrader/nt-addon-panel.svg?${GUIDE_ASSET_V}`,
  receiver: `/guides/ninjatrader/receiver-terminal.svg?${GUIDE_ASSET_V}`,
  tunnel: `/guides/ninjatrader/tunnel.svg?${GUIDE_ASSET_V}`,
  connections: `/guides/ninjatrader/connections-ui.svg?${GUIDE_ASSET_V}`,
} as const
