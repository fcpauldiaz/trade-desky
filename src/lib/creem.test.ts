import { describe, expect, it } from 'vitest'
import { checkoutUrl } from '#/lib/creem'

describe('creem', () => {
  it('builds checkout URL with user id and email metadata', () => {
    const url = checkoutUrl('user-123', 'test@example.com')
    expect(url).toContain('metadata%5Bemail%5D=test%40example.com')
    expect(url).toContain('metadata%5Buser_id%5D=user-123')
  })
})
