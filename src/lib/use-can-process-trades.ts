import { useEffect, useState } from 'react'

import { api } from '#/lib/api-client'
import { useSession } from '#/lib/auth-client'

let inflight: Promise<boolean> | null = null

function loadCanProcessTrades(): Promise<boolean> {
  if (!inflight) {
    inflight = api.me().then((me) => me.can_process_trades)
  }
  return inflight
}

export function useCanProcessTrades() {
  const { data: session, isPending: sessionPending } = useSession()
  const loggedIn = Boolean(session?.user)
  const [canProcessTrades, setCanProcessTrades] = useState(false)
  const [billingPending, setBillingPending] = useState(false)

  useEffect(() => {
    if (!loggedIn) {
      inflight = null
      setCanProcessTrades(false)
      setBillingPending(false)
      return
    }

    let cancelled = false
    setBillingPending(true)
    loadCanProcessTrades()
      .then((subscribed) => {
        if (!cancelled) setCanProcessTrades(subscribed)
      })
      .catch(() => {
        inflight = null
        if (!cancelled) setCanProcessTrades(false)
      })
      .finally(() => {
        if (!cancelled) setBillingPending(false)
      })

    return () => {
      cancelled = true
    }
  }, [loggedIn])

  return {
    loggedIn,
    canProcessTrades,
    isPending: sessionPending || (loggedIn && billingPending),
  }
}
