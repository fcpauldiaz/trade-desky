import { describe, expect, it } from 'vitest'

import {
  NINJATRADER_BRIDGE_GITHUB_URL,
  NINJATRADER_BRIDGE_GUIDE_PATH,
  NINJATRADER_BRIDGE_ZIP_URL,
} from '#/lib/ninjatrader-bridge'

describe('ninjatrader-bridge', () => {
  it('exposes GitHub archive and repo URLs for the bridge', () => {
    expect(NINJATRADER_BRIDGE_ZIP_URL).toContain('trade-desky-ninjatrader')
    expect(NINJATRADER_BRIDGE_GITHUB_URL).toContain('trade-desky-ninjatrader')
    expect(NINJATRADER_BRIDGE_GUIDE_PATH).toBe('/guides/ninjatrader')
  })
})
