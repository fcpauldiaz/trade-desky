export function requiredTrimmed(value: string, message = 'Required'): string | undefined {
  return value.trim() ? undefined : message
}

export function optionalHttpsUrl(value: string): string | undefined {
  const trimmed = value.trim()
  if (!trimmed) {
    return 'Forward URL is required'
  }

  try {
    const url = new URL(trimmed)
    if (url.protocol !== 'https:') {
      return 'Forward URL must use HTTPS'
    }
    return undefined
  } catch {
    return 'Enter a valid HTTPS URL'
  }
}
