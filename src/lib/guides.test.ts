import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import {
  NINJATRADER_BRIDGE_WIN_ASSET_PATH,
  NINJATRADER_BRIDGE_ZIP_PATH,
  NINJATRADER_GUIDE_IMAGES,
  NINJATRADER_GUIDE_PATH,
} from '#/lib/guides'

const GUIDE_SVG_DIR = join(process.cwd(), 'public/guides/ninjatrader')

describe('guides', () => {
  it('defines the NinjaTrader setup guide route and illustrated assets', () => {
    expect(NINJATRADER_GUIDE_PATH).toBe('/guides/ninjatrader')
    expect(Object.values(NINJATRADER_GUIDE_IMAGES)).toHaveLength(5)
    expect(NINJATRADER_GUIDE_IMAGES.architecture).toMatch(/^\/guides\/ninjatrader\//)
    expect(NINJATRADER_GUIDE_IMAGES.architecture).toMatch(/\.svg$/)
  })

  it('links bridge downloads to hosted desktop assets', () => {
    expect(NINJATRADER_BRIDGE_WIN_ASSET_PATH).toBe(
      '/desktop/TradeDeskyNinjaTraderReceiver-setup.exe',
    )
    expect(NINJATRADER_BRIDGE_ZIP_PATH).toBe('/desktop/TradeDeskyNinjaTraderReceiver-win.zip')
    for (const url of [NINJATRADER_BRIDGE_WIN_ASSET_PATH, NINJATRADER_BRIDGE_ZIP_PATH]) {
      expect(url.includes('github.com')).toBe(false)
    }
  })

  it('ships guide SVG assets without control-byte corruption', () => {
    const svgFiles = readdirSync(GUIDE_SVG_DIR).filter((name) => name.endsWith('.svg'))
    expect(svgFiles).toHaveLength(5)

    for (const file of svgFiles) {
      const bytes = readFileSync(join(GUIDE_SVG_DIR, file))
      expect(bytes.includes(0x14)).toBe(false)

      const xml = bytes.toString('utf8')
      expect(xml.trimStart().startsWith('<svg')).toBe(true)
      expect(xml.trimEnd().endsWith('</svg>')).toBe(true)
      expect(xml).not.toMatch(/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[\da-fA-F]+;)/)
    }

    for (const src of Object.values(NINJATRADER_GUIDE_IMAGES)) {
      expect(existsSync(join(process.cwd(), 'public', src.slice(1)))).toBe(true)
    }
  })
})
