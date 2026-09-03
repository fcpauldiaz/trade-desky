import { describe, expect, it } from 'vitest'

import { postLoginPath, unpaidAuthenticatedRedirect } from '#/lib/onboarding-funnel'

describe('postLoginPath', () => {
  it('sends unpaid users to onboarding', () => {
    expect(postLoginPath(false)).toBe('/onboarding')
  })

  it('sends subscribed users to the dashboard', () => {
    expect(postLoginPath(true)).toBe('/dashboard')
  })
})

describe('unpaidAuthenticatedRedirect', () => {
  it('keeps unpaid users on onboarding and billing', () => {
    expect(unpaidAuthenticatedRedirect({ canProcessTrades: false, pathname: '/onboarding' })).toBeNull()
    expect(unpaidAuthenticatedRedirect({ canProcessTrades: false, pathname: '/billing' })).toBeNull()
  })

  it('keeps unpaid admins on admin routes', () => {
    expect(unpaidAuthenticatedRedirect({ canProcessTrades: false, pathname: '/admin' })).toBeNull()
    expect(
      unpaidAuthenticatedRedirect({ canProcessTrades: false, pathname: '/admin/users' }),
    ).toBeNull()
  })

  it('sends unpaid users on other app pages to onboarding', () => {
    expect(unpaidAuthenticatedRedirect({ canProcessTrades: false, pathname: '/dashboard' })).toBe(
      '/onboarding',
    )
    expect(unpaidAuthenticatedRedirect({ canProcessTrades: false, pathname: '/connections' })).toBe(
      '/onboarding',
    )
    expect(unpaidAuthenticatedRedirect({ canProcessTrades: false, pathname: '/settings' })).toBe(
      '/onboarding',
    )
  })

  it('treats a failed profile fetch like unpaid except on onboarding and billing', () => {
    expect(unpaidAuthenticatedRedirect({ canProcessTrades: false, pathname: '/alerts' })).toBe(
      '/onboarding',
    )
    expect(unpaidAuthenticatedRedirect({ canProcessTrades: false, pathname: '/onboarding' })).toBeNull()
    expect(unpaidAuthenticatedRedirect({ canProcessTrades: false, pathname: '/billing' })).toBeNull()
  })

  it('sends subscribed users away from onboarding to connections', () => {
    expect(unpaidAuthenticatedRedirect({ canProcessTrades: true, pathname: '/onboarding' })).toBe(
      '/connections',
    )
  })

  it('does not redirect subscribed users on other app pages', () => {
    expect(unpaidAuthenticatedRedirect({ canProcessTrades: true, pathname: '/dashboard' })).toBeNull()
    expect(unpaidAuthenticatedRedirect({ canProcessTrades: true, pathname: '/billing' })).toBeNull()
    expect(unpaidAuthenticatedRedirect({ canProcessTrades: true, pathname: '/connections' })).toBeNull()
  })
})
