import { DESKTOP_MAC_ASSET_PATH, DESKTOP_WIN_ASSET_PATH } from '#/lib/desktop-app'
import {
  NINJATRADER_BRIDGE_DOWNLOAD_PATH,
  NINJATRADER_BRIDGE_WIN_ASSET_PATH,
  NINJATRADER_BRIDGE_ZIP_PATH,
} from '#/lib/ninjatrader-bridge'

export default function DownloadsMenu() {
  return (
    <details className="downloads-menu">
      <summary className="btn-primary btn-sm">Downloads</summary>
      <div className="downloads-menu-panel">
        <p className="downloads-menu-heading">Watcher</p>
        <a href={DESKTOP_MAC_ASSET_PATH}>macOS</a>
        <a href={DESKTOP_WIN_ASSET_PATH}>Windows</a>
        <p className="downloads-menu-heading">NinjaTrader</p>
        <a href={NINJATRADER_BRIDGE_WIN_ASSET_PATH}>Windows installer</a>
        <a href={NINJATRADER_BRIDGE_ZIP_PATH}>Portable ZIP</a>
        <a href={`${NINJATRADER_BRIDGE_DOWNLOAD_PATH}#ninjatrader`}>On download page</a>
      </div>
    </details>
  )
}
