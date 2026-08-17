export function postLoginPath(canProcessTrades: boolean): '/onboarding' | '/dashboard' {
  return canProcessTrades ? '/dashboard' : '/onboarding'
}

export function unpaidAuthenticatedRedirect(options: {
  canProcessTrades: boolean
  pathname: string
}): '/onboarding' | '/connections' | null {
  const path = normalizePath(options.pathname)
  const onOnboarding = path === '/onboarding'
  const onBilling = path === '/billing'

  if (!options.canProcessTrades) {
    if (onOnboarding || onBilling) return null
    return '/onboarding'
  }

  if (onOnboarding) return '/connections'
  return null
}

function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1)
  }
  return pathname
}
