import { describe, expect, it } from 'vitest'

import { showDownloadsForUser, showPricingForUser } from '#/lib/pricing-visibility'

describe('showPricingForUser', () => {
  it('shows pricing to guests', () => {
    expect(showPricingForUser(false, false)).toBe(true)
  })

  it('shows pricing to logged-in users who are not subscribed', () => {
    expect(showPricingForUser(true, false)).toBe(true)
  })

  it('hides pricing for logged-in subscribers', () => {
    expect(showPricingForUser(true, true)).toBe(false)
  })
})

describe('showDownloadsForUser', () => {
  it('hides downloads for guests', () => {
    expect(showDownloadsForUser(false, false)).toBe(false)
  })

  it('hides downloads for logged-in users who are not subscribed', () => {
    expect(showDownloadsForUser(true, false)).toBe(false)
  })

  it('shows downloads for logged-in subscribers', () => {
    expect(showDownloadsForUser(true, true)).toBe(true)
  })
})
