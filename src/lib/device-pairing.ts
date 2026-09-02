import type { PairedDevice } from '#/lib/api-client'

export function baseDeviceWsUrl(wsUrl: string): string {
  const trimmed = wsUrl.trim()
  if (!trimmed) return trimmed

  try {
    const url = new URL(trimmed)
    url.searchParams.delete('token')
    if (url.searchParams.size === 0) {
      return `${url.origin}${url.pathname}`
    }
    return url.toString()
  } catch {
    const queryIndex = trimmed.indexOf('?')
    if (queryIndex === -1) return trimmed

    const base = trimmed.slice(0, queryIndex)
    const query = trimmed.slice(queryIndex + 1)
    const params = query
      .split('&')
      .filter((part) => part && !part.startsWith('token='))
    return params.length > 0 ? `${base}?${params.join('&')}` : base
  }
}

export function normalizePairedDevice(paired: PairedDevice): PairedDevice {
  return {
    ...paired,
    ws_url: baseDeviceWsUrl(paired.ws_url),
  }
}
