import { createFileRoute, Outlet, redirect, useNavigate, useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { api } from '#/lib/api-client'
import { getSession } from '#/lib/auth.functions'
import { unpaidAuthenticatedRedirect } from '#/lib/onboarding-funnel'

export const Route = createFileRoute('/_authenticated')({
  head: () => ({
    meta: [{ name: 'robots', content: 'noindex, nofollow' }],
  }),
  beforeLoad: async () => {
    const session = await getSession()
    if (!session) {
      throw redirect({ to: '/login' })
    }
    return { user: session.user }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    setReady(false)
    api
      .me()
      .then((me) => {
        if (cancelled) return
        const to = unpaidAuthenticatedRedirect({
          canProcessTrades: me.can_process_trades,
          pathname,
        })
        if (to) {
          void navigate({ to })
          return
        }
        setReady(true)
      })
      .catch(() => {
        if (!cancelled) setReady(true)
      })
    return () => {
      cancelled = true
    }
  }, [pathname, navigate])

  if (!ready) return null
  return <Outlet />
}
