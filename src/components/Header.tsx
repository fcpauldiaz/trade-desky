import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import DownloadsMenu from '#/components/DownloadsMenu'
import { useIsAdmin } from '#/lib/admin'
import { clearReceiverTokenCache } from '#/lib/api-client'
import { signOut, useSession } from '#/lib/auth-client'
import { showDownloadsForUser, showPricingForUser } from '#/lib/pricing-visibility'
import { useCanProcessTrades } from '#/lib/use-can-process-trades'

type NavLinkProps = {
  to: string
  children: React.ReactNode
  onNavigate?: () => void
}

function NavLink({ to, children, onNavigate }: NavLinkProps) {
  return (
    <Link
      to={to}
      className="nav-link"
      activeProps={{ className: 'nav-link is-active' }}
      onClick={onNavigate}
    >
      {children}
    </Link>
  )
}

export default function Header() {
  const { data: session, isPending } = useSession()
  const { canProcessTrades, isPending: subscriptionPending } = useCanProcessTrades()
  const { isAdmin } = useIsAdmin()
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const [menuOpen, setMenuOpen] = useState(false)
  const loggedIn = Boolean(session?.user)
  const showPricing = showPricingForUser(loggedIn, canProcessTrades, subscriptionPending)
  const showDownloads = showDownloadsForUser(loggedIn, canProcessTrades, subscriptionPending)

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.classList.toggle('site-nav-open', menuOpen)
    return () => {
      document.body.classList.remove('site-nav-open')
    }
  }, [menuOpen])

  async function logout() {
    clearReceiverTokenCache()
    await signOut()
    navigate({ to: '/' })
  }

  function closeMenu() {
    setMenuOpen(false)
  }

  const publicLinks = (
    <>
      <NavLink to="/" onNavigate={closeMenu}>
        Home
      </NavLink>
      {showPricing ? (
        <NavLink to="/pricing" onNavigate={closeMenu}>
          Pricing
        </NavLink>
      ) : null}
      <NavLink to="/integrations" onNavigate={closeMenu}>
        Integrations
      </NavLink>
      <NavLink to="/reviews" onNavigate={closeMenu}>
        Reviews
      </NavLink>
    </>
  )

  const authLinks = loggedIn ? (
    <>
      <NavLink to="/dashboard" onNavigate={closeMenu}>
        Dashboard
      </NavLink>
      <NavLink to="/alerts" onNavigate={closeMenu}>
        Alerts
      </NavLink>
      <NavLink to="/connections" onNavigate={closeMenu}>
        Connections
      </NavLink>
      <NavLink to="/billing" onNavigate={closeMenu}>
        Billing
      </NavLink>
      <NavLink to="/settings" onNavigate={closeMenu}>
        Settings
      </NavLink>
      {isAdmin ? (
        <NavLink to="/admin" onNavigate={closeMenu}>
          Admin
        </NavLink>
      ) : null}
      <button type="button" onClick={logout} className="nav-link">
        Log out
      </button>
    </>
  ) : !isPending ? (
    <NavLink to="/login" onNavigate={closeMenu}>
      Log in
    </NavLink>
  ) : null

  return (
    <header className="site-header">
      <nav className="page-wrap site-header-inner px-4 sm:px-6 lg:px-8" aria-label="Main">
        <Link to="/" className="site-brand">
          <img
            src="/logo192.png"
            alt="Trade Desky"
            width={40}
            height={40}
            className="site-logo-mark"
          />
          <span className="site-logo-text">Trade Desky</span>
        </Link>

        <div className="site-nav site-nav--desktop">
          {publicLinks}
          {authLinks}
        </div>

        <div className="site-header-actions">
          {showDownloads ? <DownloadsMenu /> : null}
          {!loggedIn && !isPending ? (
            <Link to="/signup" className="btn-primary btn-sm site-header-signup">
              Sign up
            </Link>
          ) : null}
          <button
            type="button"
            className="site-nav-toggle"
            aria-expanded={menuOpen}
            aria-controls="site-mobile-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
            <span className="site-nav-toggle-bars" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </nav>

      <div
        id="site-mobile-nav"
        className={`site-mobile-nav${menuOpen ? ' is-open' : ''}`}
        hidden={!menuOpen}
      >
        <div className="page-wrap site-mobile-nav-inner px-4 sm:px-6 lg:px-8">
          <div className="site-mobile-nav-links">
            {publicLinks}
            {authLinks}
          </div>
          {!loggedIn && !isPending ? (
            <Link to="/signup" className="btn-primary w-full site-mobile-nav-cta" onClick={closeMenu}>
              Sign up
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  )
}
