import { describe, expect, it } from 'vitest'

import {
  NINJATRADER_BRIDGE_ZIP_URL,
  NINJATRADER_GUIDE_IMAGES,
  NINJATRADER_GUIDE_PATH,
} from '#/lib/guides'

describe('guides', () => {
  it('defines the NinjaTrader setup guide route and illustrated assets', () => {
    expect(NINJATRADER_GUIDE_PATH).toBe('/guides/ninjatrader')
    expect(Object.values(NINJATRADER_GUIDE_IMAGES)).toHaveLength(5)
    expect(NINJATRADER_GUIDE_IMAGES.architecture).toMatch(/^\/guides\/ninjatrader\//)
  })

  it('links bridge zip download to the public GitHub archive', () => {
    expect(NINJATRADER_BRIDGE_ZIP_URL).toContain('trade-desky-ninjatrader')
    expect(NINJATRADER_BRIDGE_ZIP_URL).toContain('archive/refs/heads/main.zip')
  })
})
