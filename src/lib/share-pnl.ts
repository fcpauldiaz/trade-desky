import { toBlob } from 'html-to-image'
import { PRODUCT_NAME } from '#/lib/site'
import { formatDayLabel, formatMonthLabel } from '#/lib/pnl-calendar'

export function formatSignedUsd(amount: number): string {
  const formatted = Math.abs(amount).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })
  if (amount > 0) return `+${formatted}`
  if (amount < 0) return `-${formatted}`
  return formatted
}

export function pnlCaption(kind: 'month' | 'day', key: string, pnl: number): string {
  const label = kind === 'month' ? formatMonthLabel(key) : formatDayLabel(key)
  return `${label} · ${formatSignedUsd(pnl)} · ${PRODUCT_NAME}`
}

export function pnlShareFilename(kind: 'month' | 'day', key: string): string {
  return `trade-desky-pnl-${key}.png`
}

export async function capturePng(node: HTMLElement): Promise<Blob> {
  const blob = await toBlob(node, {
    cacheBust: true,
    pixelRatio: 2,
    width: node.offsetWidth,
    height: node.offsetHeight,
    backgroundColor: '#ffffff',
  })
  if (!blob) {
    throw new Error('Could not capture P&L card')
  }
  return blob
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export async function shareOrDownload(opts: {
  blob: Blob
  filename: string
  caption: string
}): Promise<'shared' | 'downloaded'> {
  const file = new File([opts.blob], opts.filename, { type: 'image/png' })
  const canShareFiles =
    typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })

  if (canShareFiles && typeof navigator.share === 'function') {
    try {
      await navigator.share({
        files: [file],
        text: opts.caption,
        title: opts.caption,
      })
      return 'shared'
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return 'shared'
      }
    }
  }

  downloadBlob(opts.blob, opts.filename)
  if (typeof navigator.clipboard?.writeText === 'function') {
    await navigator.clipboard.writeText(opts.caption).catch(() => undefined)
  }
  return 'downloaded'
}
