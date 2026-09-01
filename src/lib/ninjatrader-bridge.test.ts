import { describe, expect, it } from 'vitest'

import {
  NINJATRADER_BRIDGE_GUIDE_PATH,
  NINJATRADER_BRIDGE_ZIP_URL,
} from '#/lib/ninjatrader-bridge'

describe('ninjatrader-bridge', () => {
  it('exposes bridge archive and on-site guide paths', () => {
    expect(NINJATRADER_BRIDGE_ZIP_URL).toContain('trade-desky-ninjatrader')
    expect(NINJATRADER_BRIDGE_ZIP_URL).toContain('archive/refs/heads/main.zip')
    expect(NINJATRADER_BRIDGE_GUIDE_PATH).toBe('/guides/ninjatrader')
  })
})
