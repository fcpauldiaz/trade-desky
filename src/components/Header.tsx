import { Link, useNavigate } from '@tanstack/react-router'
import DownloadsMenu from '#/components/DownloadsMenu'
import { useIsAdmin } from '#/lib/admin'
import { clearReceiverTokenCache } from '#/lib/api-client'
import { signOut, useSession } from '#/lib/auth-client'
import { showDownloadsForUser, showPricingForUser } from '#/lib/pricing-visibility'
import { useCanProcessTrades } from '#/lib/use-can-process-trades'

export default function Header() {
  const { data: session, isPending } = useSession()
  const { canProcessTrades, isPending: subscriptionPending } = useCanProcessTrades()
  const { isAdmin } = useIsAdmin()
  const navigate = useNavigate()
  const loggedIn = Boolean(session?.user)
  const showPricing = showPricingForUser(loggedIn, canProcessTrades, subscriptionPending)
  const showDownloads = showDownloadsForUser(loggedIn, canProcessTrades, subscriptionPending)

  async function logout() {
    clearReceiverTokenCache()
    await signOut()
    navigate({ to: '/' })
  }

  return (
    <header className="site-header">
      <nav className="page-wrap site-header-inner px-4 sm:px-6 lg:px-8">
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
        <div className="site-nav">
          <Link to="/" className="nav-link" activeProps={{ className: 'nav-link is-active' }}>
            Home
          </Link>
          {showPricing ? (
            <Link to="/pricing" className="nav-link" activeProps={{ className: 'nav-link is-active' }}>
              Pricing
            </Link>
          ) : null}
          <Link to="/integrations" className="nav-link" activeProps={{ className: 'nav-link is-active' }}>
            Integrations
          </Link>
          <Link to="/reviews" className="nav-link" activeProps={{ className: 'nav-link is-active' }}>
            Reviews
          </Link>
          {loggedIn ? (
            <>
              <Link to="/dashboard" className="nav-link" activeProps={{ className: 'nav-link is-active' }}>
                Dashboard
              </Link>
              <Link to="/alerts" className="nav-link" activeProps={{ className: 'nav-link is-active' }}>
                Alerts
              </Link>
              <Link to="/connections" className="nav-link" activeProps={{ className: 'nav-link is-active' }}>
                Connections
              </Link>
              <Link to="/billing" className="nav-link" activeProps={{ className: 'nav-link is-active' }}>
                Billing
              </Link>
              <Link to="/settings" className="nav-link" activeProps={{ className: 'nav-link is-active' }}>
                Settings
              </Link>
              {isAdmin ? (
                <Link to="/admin" className="nav-link" activeProps={{ className: 'nav-link is-active' }}>
                  Admin
                </Link>
              ) : null}
              <button type="button" onClick={logout} className="nav-link">
                Log out
              </button>
            </>
          ) : !isPending ? (
            <>
              <Link to="/login" className="nav-link" activeProps={{ className: 'nav-link is-active' }}>
                Log in
              </Link>
            </>
          ) : null}
        </div>
        <div className="site-header-actions">
          {showDownloads ? <DownloadsMenu /> : null}
          {!loggedIn && !isPending ? (
            <Link to="/signup" className="btn-primary btn-sm">
              Sign up
            </Link>
          ) : null}
        </div>
      </nav>
    </header>
  )
}
