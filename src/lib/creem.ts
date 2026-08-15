export const CREEM_CHECKOUT_URL =
  import.meta.env.VITE_CREEM_CHECKOUT_URL || 'https://creem.io/payment/prod_pro'

export function checkoutUrl(userId: string, email: string): string {
  const url = new URL(CREEM_CHECKOUT_URL)
  url.searchParams.set('metadata[user_id]', userId)
  url.searchParams.set('metadata[email]', email)
  return url.toString()
}
