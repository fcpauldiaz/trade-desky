import { DESKTOP_MAC_ASSET_PATH, DESKTOP_WIN_ASSET_PATH } from '#/lib/desktop-app'

export default function DownloadsMenu() {
  return (
    <details className="downloads-menu">
      <summary className="btn-primary btn-sm">Downloads</summary>
      <div className="downloads-menu-panel">
        <a href={DESKTOP_MAC_ASSET_PATH}>macOS</a>
        <a href={DESKTOP_WIN_ASSET_PATH}>Windows</a>
      </div>
    </details>
  )
}
