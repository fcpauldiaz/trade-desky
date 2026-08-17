import { useEffect, useState } from 'react'

import { api } from '#/lib/api-client'
import { useSession } from '#/lib/auth-client'

let inflight: Promise<boolean> | null = null
let lastKnown: boolean | null = null
let cacheEpoch = 0
const listeners = new Set<() => void>()

function loadCanProcessTrades(): Promise<boolean> {
  if (!inflight) {
    inflight = api.me().then((me) => {
      lastKnown = me.can_process_trades
      return lastKnown
    })
  }
  return inflight
}

export function invalidateCanProcessTradesCache() {
  inflight = null
  cacheEpoch += 1
  for (const listener of listeners) {
    listener()
  }
}

export function useCanProcessTrades() {
  const { data: session, isPending: sessionPending } = useSession()
  const loggedIn = Boolean(session?.user)
  const [canProcessTrades, setCanProcessTrades] = useState(lastKnown === true)
  const [resolved, setResolved] = useState(lastKnown !== null)
  const [billingPending, setBillingPending] = useState(false)
  const [epoch, setEpoch] = useState(cacheEpoch)

  useEffect(() => {
    const sync = () => setEpoch(cacheEpoch)
    listeners.add(sync)
    return () => {
      listeners.delete(sync)
    }
  }, [])

  useEffect(() => {
    if (!loggedIn) {
      inflight = null
      lastKnown = null
      setCanProcessTrades(false)
      setResolved(false)
      setBillingPending(false)
      return
    }

    let cancelled = false
    setBillingPending(true)
    loadCanProcessTrades()
      .then((subscribed) => {
        if (!cancelled) {
          setCanProcessTrades(subscribed)
          setResolved(true)
        }
      })
      .catch(() => {
        inflight = null
        if (!cancelled && lastKnown !== null) {
          setCanProcessTrades(lastKnown)
          setResolved(true)
        }
      })
      .finally(() => {
        if (!cancelled) setBillingPending(false)
      })

    return () => {
      cancelled = true
    }
  }, [loggedIn, epoch])

  return {
    loggedIn,
    canProcessTrades,
    isPending: sessionPending || (loggedIn && (billingPending || !resolved)),
  }
}
