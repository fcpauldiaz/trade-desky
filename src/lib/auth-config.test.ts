import { describe, expect, it } from 'vitest'

import {
  isLocalhostUrl,
  requiresBetterAuthSecret,
  resolveBetterAuthSecret,
} from '#/lib/auth-config'

describe('isLocalhostUrl', () => {
  it('treats localhost and loopback hosts as local', () => {
    expect(isLocalhostUrl('http://localhost:3000')).toBe(true)
    expect(isLocalhostUrl('http://127.0.0.1:3000')).toBe(true)
    expect(isLocalhostUrl('http://[::1]:3000')).toBe(true)
  })

  it('treats public hosts as non-local', () => {
    expect(isLocalhostUrl('https://app.tradedesky.com')).toBe(false)
  })
})

describe('requiresBetterAuthSecret', () => {
  it('requires a secret in production', () => {
    expect(
      requiresBetterAuthSecret({
        NODE_ENV: 'production',
        BETTER_AUTH_URL: 'http://localhost:3000',
      }),
    ).toBe(true)
  })

  it('requires a secret when BETTER_AUTH_URL is non-localhost', () => {
    expect(
      requiresBetterAuthSecret({
        NODE_ENV: 'development',
        BETTER_AUTH_URL: 'https://app.tradedesky.com',
      }),
    ).toBe(true)
  })

  it('allows local dev fallback when localhost and not production', () => {
    expect(
      requiresBetterAuthSecret({
        NODE_ENV: 'development',
        BETTER_AUTH_URL: 'http://localhost:3000',
      }),
    ).toBe(false)
  })
})

describe('resolveBetterAuthSecret', () => {
  it('returns a trimmed secret when set', () => {
    expect(
      resolveBetterAuthSecret({
        BETTER_AUTH_SECRET: '  stable-production-secret  ',
        NODE_ENV: 'production',
      }),
    ).toBe('stable-production-secret')
  })

  it('uses the dev fallback for localhost development', () => {
    expect(
      resolveBetterAuthSecret({
        NODE_ENV: 'development',
        BETTER_AUTH_URL: 'http://localhost:3000',
      }),
    ).toBe('dev-better-auth-secret-change-in-production')
  })

  it('throws in production when the secret is missing', () => {
    expect(() =>
      resolveBetterAuthSecret({
        NODE_ENV: 'production',
        BETTER_AUTH_URL: 'https://app.tradedesky.com',
      }),
    ).toThrow(/BETTER_AUTH_SECRET is required/)
  })

  it('throws for non-localhost URLs even outside production', () => {
    expect(() =>
      resolveBetterAuthSecret({
        NODE_ENV: 'development',
        BETTER_AUTH_URL: 'https://app.tradedesky.com',
      }),
    ).toThrow(/BETTER_AUTH_SECRET is required/)
  })

  it('throws for empty secrets in production', () => {
    expect(() =>
      resolveBetterAuthSecret({
        BETTER_AUTH_SECRET: '   ',
        NODE_ENV: 'production',
        BETTER_AUTH_URL: 'https://app.tradedesky.com',
      }),
    ).toThrow(/BETTER_AUTH_SECRET is required/)
  })
})
