import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { api, type AdminUser } from '#/lib/api-client'

export const Route = createFileRoute('/_authenticated/admin/users')({
  component: AdminUsersPage,
})

type Draft = {
  status: string
  plan_name: string
  role: 'user' | 'admin'
}

function AdminUsersPage() {
  const [email, setEmail] = useState('')
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState<AdminUser[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [drafts, setDrafts] = useState<Record<string, Draft>>({})
  const [confirmRevoke, setConfirmRevoke] = useState<string | null>(null)
  const [savingId, setSavingId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    api
      .adminUsers(query || undefined)
      .then((list) => {
        if (cancelled) return
        setUsers(list)
        const next: Record<string, Draft> = {}
        for (const user of list) {
          next[user.id] = {
            status: user.status,
            plan_name: user.plan_name,
            role: user.role === 'admin' ? 'admin' : 'user',
          }
        }
        setDrafts(next)
      })
      .catch(() => {
        if (!cancelled) setError('Could not load users')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [query])

  async function updateUser(user: AdminUser) {
    const draft = drafts[user.id]
    if (!draft) return
    const isRevoke = !['active', 'trialing'].includes(draft.status)
    if (isRevoke && confirmRevoke !== user.id) {
      setConfirmRevoke(user.id)
      return
    }
    setSavingId(user.id)
    setError('')
    try {
      const [subResult, roleResult] = await Promise.all([
        api.adminUpdateSubscription(user.id, {
          status: draft.status,
          plan_name: draft.plan_name,
        }),
        draft.role !== user.role
          ? api.adminUpdateRole(user.id, { role: draft.role })
          : Promise.resolve({ user_id: user.id, role: user.role }),
      ])
      setUsers((prev) =>
        prev.map((row) =>
          row.id === user.id
            ? {
                ...row,
                status: subResult.status,
                plan_name: subResult.plan_name,
                can_process_trades: subResult.can_process_trades,
                role: roleResult.role,
              }
            : row,
        ),
      )
      setConfirmRevoke(null)
    } catch {
      setError(`Could not update ${user.email}`)
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="admin-fade min-w-0 space-y-4">
      <div className="admin-filter-bar">
        <label className="admin-filter-field">
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="demo-input"
            placeholder="search@"
          />
        </label>
        <div className="flex items-end gap-2">
          <button type="button" className="btn-primary btn-sm" onClick={() => setQuery(email.trim())}>
            Search
          </button>
          <button
            type="button"
            className="btn-secondary btn-sm"
            onClick={() => {
              setEmail('')
              setQuery('')
            }}
          >
            Clear
          </button>
        </div>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {loading ? <p className="text-sm text-[var(--ja-gray-600)]">Loading…</p> : null}
      {!loading ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Name</th>
                <th>Role</th>
                <th>Plan / status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const draft =
                  drafts[user.id] ||
                  ({
                    status: user.status,
                    plan_name: user.plan_name,
                    role: user.role === 'admin' ? 'admin' : 'user',
                  } satisfies Draft)
                return (
                  <tr key={user.id}>
                    <td className="text-xs font-semibold">{user.email}</td>
                    <td className="text-xs">{user.name || '—'}</td>
                    <td className="text-xs">
                      <select
                        className="demo-input"
                        value={draft.role}
                        onChange={(e) =>
                          setDrafts((prev) => ({
                            ...prev,
                            [user.id]: {
                              ...draft,
                              role: e.target.value === 'admin' ? 'admin' : 'user',
                            },
                          }))
                        }
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td className="text-xs">
                      <div className="flex flex-wrap gap-2">
                        <select
                          className="demo-input"
                          value={draft.plan_name}
                          onChange={(e) =>
                            setDrafts((prev) => ({
                              ...prev,
                              [user.id]: { ...draft, plan_name: e.target.value },
                            }))
                          }
                        >
                          <option value="free">free</option>
                          <option value="pro">pro</option>
                        </select>
                        <select
                          className="demo-input"
                          value={draft.status}
                          onChange={(e) =>
                            setDrafts((prev) => ({
                              ...prev,
                              [user.id]: { ...draft, status: e.target.value },
                            }))
                          }
                        >
                          <option value="none">none</option>
                          <option value="active">active</option>
                          <option value="trialing">trialing</option>
                          <option value="cancelled">cancelled</option>
                        </select>
                      </div>
                    </td>
                    <td className="whitespace-nowrap text-xs">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="flex flex-wrap items-center gap-2">
                        {confirmRevoke === user.id ? (
                          <>
                            <span className="text-xs text-[var(--ja-gray-600)]">Confirm?</span>
                            <button
                              type="button"
                              className="btn-primary btn-sm"
                              disabled={savingId === user.id}
                              onClick={() => void updateUser(user)}
                            >
                              Yes
                            </button>
                            <button
                              type="button"
                              className="btn-secondary btn-sm"
                              onClick={() => setConfirmRevoke(null)}
                            >
                              No
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            className="btn-primary btn-sm"
                            disabled={savingId === user.id}
                            onClick={() => void updateUser(user)}
                          >
                            Update
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {users.length === 0 ? (
            <p className="mt-3 text-sm text-[var(--ja-gray-600)]">No users</p>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
