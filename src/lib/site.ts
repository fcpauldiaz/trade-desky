export const SITE_URL = (
  import.meta.env.VITE_SITE_URL || 'https://tradedesky.chapilabs.com'
).replace(/\/$/, '')

export const SUPPORT_EMAIL = 'support@chapilabs.com'
export const COMPANY_NAME = 'Chapi Labs'
export const PRODUCT_NAME = 'Trade Desky'
export const PRO_PRICE_USD = 19.99
export const PRO_PRICE_LABEL = '$19.99'
export const LEGAL_UPDATED = 'August 15, 2026'
export const LEGAL_REGION = 'the United States'
export const CREEM_TERMS_URL = 'https://www.creem.io/terms'
export const CREEM_PRIVACY_URL = 'https://www.creem.io/privacy'
export const OG_IMAGE_PATH = '/og.png'

export function canonicalUrl(path: string): string {
  if (path === '/') return SITE_URL
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}
