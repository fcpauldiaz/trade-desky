export const SITE_URL = (
  import.meta.env.VITE_SITE_URL || 'https://tradedesky.chapilabs.com'
).replace(/\/$/, '')

export const SUPPORT_EMAIL = 'support@chapilabs.com'
export const COMPANY_NAME = 'Chapi Labs'
export const PRODUCT_NAME = 'Trade Desky'
export const PRO_PRICE_USD = 39.99
export const PRO_PRICE_LABEL = '$39.99'
export const PRO_YEARLY_PRICE_USD = 299
export const PRO_YEARLY_PRICE_LABEL = '$299'
export const PRO_YEARLY_VS_MONTHLY_SAVINGS_USD = roundUsd(PRO_PRICE_USD * 12 - PRO_YEARLY_PRICE_USD)
export const PRO_YEARLY_SAVINGS_PERCENT = Math.round(
  (PRO_YEARLY_VS_MONTHLY_SAVINGS_USD / (PRO_PRICE_USD * 12)) * 100,
)
export const PRO_YEARLY_SAVINGS_PILL = `Save $${Math.round(PRO_YEARLY_VS_MONTHLY_SAVINGS_USD)} · ${PRO_YEARLY_SAVINGS_PERCENT}%`

function roundUsd(amount: number): number {
  return Math.round(amount * 100) / 100
}

export const LEGAL_UPDATED = 'September 2, 2026'
export const LEGAL_REGION = 'the United States'
export const OG_IMAGE_PATH = '/og.png'

export function canonicalUrl(path: string): string {
  if (path === '/') return SITE_URL
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}
