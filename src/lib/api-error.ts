export function apiErrorMessage(text: string, fallback: string): string {
  if (!text) return fallback
  try {
    const body = JSON.parse(text) as { detail?: unknown }
    if (typeof body.detail === 'string' && body.detail) return body.detail
  } catch {
    return text
  }
  return text
}
