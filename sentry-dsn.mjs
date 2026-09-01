export function normalizeSentryDsn(raw) {
  const trimmed = raw?.trim()
  if (!trimmed) {
    return undefined
  }

  if (trimmed.startsWith('https://') || trimmed.startsWith('http://')) {
    return trimmed
  }

  return `https://${trimmed}/1`
}
