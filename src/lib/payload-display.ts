export type ParsedPayload =
  | { kind: 'json'; value: unknown; pretty: string }
  | { kind: 'text'; value: string }

export function parsePayload(raw: string): ParsedPayload {
  const trimmed = raw.trim()
  if (!trimmed) {
    return { kind: 'text', value: '' }
  }
  try {
    const value = JSON.parse(trimmed) as unknown
    return { kind: 'json', value, pretty: JSON.stringify(value, null, 2) }
  } catch {
    return { kind: 'text', value: raw }
  }
}

export function jsonNodeLabel(value: unknown): string {
  if (value === null) return 'null'
  if (Array.isArray(value)) return `Array(${value.length})`
  if (typeof value === 'object') return `Object(${Object.keys(value as object).length})`
  if (typeof value === 'string') return `"${value}"`
  return String(value)
}

export function isExpandable(value: unknown): boolean {
  return value !== null && typeof value === 'object'
}
