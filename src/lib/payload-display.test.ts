import { describe, expect, it } from 'vitest'

import { jsonNodeLabel, parsePayload } from '#/lib/payload-display'

describe('parsePayload', () => {
  it('pretty-prints valid JSON', () => {
    const parsed = parsePayload('{"symbol":"SPY","qty":1}')
    expect(parsed.kind).toBe('json')
    if (parsed.kind === 'json') {
      expect(parsed.pretty).toContain('"symbol": "SPY"')
      expect(parsed.value).toEqual({ symbol: 'SPY', qty: 1 })
    }
  })

  it('falls back to text for invalid JSON', () => {
    const parsed = parsePayload('plain text body')
    expect(parsed).toEqual({ kind: 'text', value: 'plain text body' })
  })

  it('handles empty payloads', () => {
    expect(parsePayload('   ')).toEqual({ kind: 'text', value: '' })
  })
})

describe('jsonNodeLabel', () => {
  it('labels common value types', () => {
    expect(jsonNodeLabel(null)).toBe('null')
    expect(jsonNodeLabel([1, 2])).toBe('Array(2)')
    expect(jsonNodeLabel({ a: 1 })).toBe('Object(1)')
    expect(jsonNodeLabel('hi')).toBe('"hi"')
    expect(jsonNodeLabel(42)).toBe('42')
  })
})
