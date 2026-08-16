export function showPricingForUser(loggedIn: boolean, subscribed: boolean): boolean {
  return !(loggedIn && subscribed)
}

export function showDownloadsForUser(loggedIn: boolean, subscribed: boolean): boolean {
  return loggedIn && subscribed
}
