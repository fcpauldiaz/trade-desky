import { describe, expect, it } from 'vitest'
import { optionalHttpsUrl, requiredTrimmed } from '#/lib/connection-form-validators'

describe('requiredTrimmed', () => {
  it('returns an error for blank values', () => {
    expect(requiredTrimmed('   ')).toBe('Required')
  })

  it('returns undefined for non-empty trimmed values', () => {
    expect(requiredTrimmed(' token ')).toBeUndefined()
  })
})

describe('optionalHttpsUrl', () => {
  it('requires a value', () => {
    expect(optionalHttpsUrl('')).toBe('Forward URL is required')
  })

  it('requires https protocol', () => {
    expect(optionalHttpsUrl('http://example.com/webhook')).toBe('Forward URL must use HTTPS')
  })

  it('accepts valid https urls', () => {
    expect(optionalHttpsUrl('https://tunnel.example.com/webhook')).toBeUndefined()
  })

  it('rejects malformed urls', () => {
    expect(optionalHttpsUrl('not-a-url')).toBe('Enter a valid HTTPS URL')
  })
})
