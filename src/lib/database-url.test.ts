import { describe, expect, it } from 'vitest'

import { resolveDatabaseUrl } from '#/lib/database-url'

describe('resolveDatabaseUrl', () => {
  it('defaults to local postgres when DATABASE_URL is unset', () => {
    const previous = process.env.DATABASE_URL
    delete process.env.DATABASE_URL
    try {
      expect(resolveDatabaseUrl()).toBe('postgresql://trade:trade@localhost:5432/trade')
    } finally {
      if (previous === undefined) {
        delete process.env.DATABASE_URL
      } else {
        process.env.DATABASE_URL = previous
      }
    }
  })

  it('accepts postgresql URLs', () => {
    expect(resolveDatabaseUrl('postgresql://trade:trade@db:5432/trade')).toBe(
      'postgresql://trade:trade@db:5432/trade',
    )
  })

  it('accepts postgres URLs', () => {
    expect(resolveDatabaseUrl('postgres://trade:trade@db:5432/trade')).toBe(
      'postgres://trade:trade@db:5432/trade',
    )
  })

  it('strips wrapping quotes', () => {
    expect(resolveDatabaseUrl('"postgresql://trade:trade@localhost:5432/trade"')).toBe(
      'postgresql://trade:trade@localhost:5432/trade',
    )
  })

  it('rejects libsql and sqlite URLs', () => {
    expect(() => resolveDatabaseUrl('libsql://db-org.turso.io')).toThrow(/postgresql/)
    expect(() => resolveDatabaseUrl('file:./data/trade.db')).toThrow(/postgresql/)
  })
})
