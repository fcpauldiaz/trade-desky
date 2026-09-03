function stripQuotes(value: string): string {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1)
  }
  return value
}

export function resolveDatabaseUrl(rawUrl?: string): string {
  const raw = stripQuotes(
    rawUrl ?? process.env.DATABASE_URL ?? 'postgresql://trade:trade@localhost:5432/trade',
  )

  if (raw.startsWith('postgresql://') || raw.startsWith('postgres://')) {
    return raw
  }

  throw new Error(
    'DATABASE_URL must be postgresql:// or postgres:// to match trade-receiver.',
  )
}
