import { Link, createFileRoute, Outlet, useNavigate, useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { api } from '#/lib/api-client'

export const Route = createFileRoute('/_authenticated/admin')({
  component: AdminLayout,
})

const NAV: Array<{
  to: '/admin' | '/admin/ai-evaluations' | '/admin/agents' | '/admin/users' | '/admin/alerts'
  label: string
  exact?: boolean
}> = [
  { to: '/admin', label: 'Overview', exact: true },
  { to: '/admin/ai-evaluations', label: 'AI evaluations' },
  { to: '/admin/agents', label: 'Agents' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/alerts', label: 'Alerts' },
]

function AdminLayout() {
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    api
      .me()
      .then((me) => {
        if (cancelled) return
        if (me.role !== 'admin') {
          void navigate({ to: '/dashboard' })
          return
        }
        setReady(true)
      })
      .catch(() => {
        if (!cancelled) void navigate({ to: '/dashboard' })
      })
    return () => {
      cancelled = true
    }
  }, [navigate])

  if (!ready) return null

  return (
    <main className="page-wrap admin-page space-y-6 px-4 py-10">
      <div>
        <h1 className="app-page-title text-[var(--ja-black)]">Admin</h1>
        <p className="mt-1 text-sm text-[var(--ja-gray-600)]">Supervise AI, users, and ingest</p>
      </div>
      <nav className="admin-subnav" aria-label="Admin">
        {NAV.map((item) => {
          const active = item.exact
            ? pathname === item.to
            : pathname === item.to || pathname.startsWith(`${item.to}/`)
          return (
            <Link
              key={item.to}
              to={item.to}
              className={active ? 'admin-subnav-link is-active' : 'admin-subnav-link'}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
      <Outlet />
    </main>
  )
}
