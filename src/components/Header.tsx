import { Link, useNavigate } from '@tanstack/react-router'
import { clearReceiverTokenCache } from '#/lib/api-client'
import { signOut, useSession } from '#/lib/auth-client'

export default function Header() {
  const { data: session, isPending } = useSession()
  const navigate = useNavigate()
  const loggedIn = Boolean(session?.user)

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
          <Link to="/pricing" className="nav-link" activeProps={{ className: 'nav-link is-active' }}>
            Pricing
          </Link>
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
              <Link to="/connections" className="nav-link" activeProps={{ className: 'nav-link is-active' }}>
                Connections
              </Link>
              <Link to="/billing" className="nav-link" activeProps={{ className: 'nav-link is-active' }}>
                Billing
              </Link>
              <Link to="/settings" className="nav-link" activeProps={{ className: 'nav-link is-active' }}>
                Settings
              </Link>
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
