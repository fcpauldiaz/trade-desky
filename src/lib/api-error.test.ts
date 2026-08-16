import { describe, expect, it } from 'vitest'

import { apiErrorMessage } from '#/lib/api-error'

describe('apiErrorMessage', () => {
  it('reads FastAPI detail strings', () => {
    expect(apiErrorMessage('{"detail":"Invalid token"}', 'Unauthorized')).toBe('Invalid token')
  })

  it('falls back when the body is empty', () => {
    expect(apiErrorMessage('', 'Unauthorized')).toBe('Unauthorized')
  })

  it('keeps non-JSON error bodies', () => {
    expect(apiErrorMessage('Could not load brokers', 'Error')).toBe('Could not load brokers')
  })
})
