export function showPricingForUser(
  loggedIn: boolean,
  subscribed: boolean,
  isPending = false,
): boolean {
  if (loggedIn && isPending) return false
  return !(loggedIn && subscribed)
}

export function showDownloadsForUser(
  loggedIn: boolean,
  subscribed: boolean,
  isPending = false,
): boolean {
  if (loggedIn && isPending) return false
  return loggedIn && subscribed
}
