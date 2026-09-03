import { useEffect, useState } from 'react'

import { api } from '#/lib/api-client'
import { useSession } from '#/lib/auth-client'

let inflight: Promise<boolean> | null = null
let lastKnown: boolean | null = null
let cacheEpoch = 0
const listeners = new Set<() => void>()

function loadIsAdmin(): Promise<boolean> {
  if (!inflight) {
    const epochAtStart = cacheEpoch
    inflight = api.me().then((me) => {
      const admin = me.role === 'admin'
      if (epochAtStart === cacheEpoch) {
        lastKnown = admin
      }
      return admin
    })
  }
  return inflight
}

export function invalidateAdminCache() {
  inflight = null
  cacheEpoch += 1
  for (const listener of listeners) {
    listener()
  }
}

export function useIsAdmin() {
  const { data: session, isPending: sessionPending } = useSession()
  const loggedIn = Boolean(session?.user)
  const [isAdmin, setIsAdmin] = useState(lastKnown === true)
  const [resolved, setResolved] = useState(lastKnown !== null)
  const [pending, setPending] = useState(false)
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
      setIsAdmin(false)
      setResolved(false)
      setPending(false)
      return
    }

    let cancelled = false
    setPending(true)
    loadIsAdmin()
      .then((admin) => {
        if (!cancelled) {
          setIsAdmin(admin)
          setResolved(true)
        }
      })
      .catch(() => {
        inflight = null
        if (!cancelled) {
          setIsAdmin(lastKnown ?? false)
          setResolved(true)
        }
      })
      .finally(() => {
        if (!cancelled) setPending(false)
      })

    return () => {
      cancelled = true
    }
  }, [loggedIn, epoch])

  return {
    loggedIn,
    isAdmin,
    isPending: sessionPending || (loggedIn && (pending || !resolved)),
  }
}
