import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { api, type AdminAgentConfig, type AdminAgentKey } from '#/lib/api-client'

export const Route = createFileRoute('/_authenticated/admin/agents')({
  component: AdminAgentsPage,
})

const MODEL_SUGGESTIONS = [
  'openai/gpt-4o-mini',
  'openai/gpt-4o',
  'openai/gpt-4.1-mini',
] as const

const PLACEHOLDER_HINT: Record<AdminAgentKey, string> = {
  parse: 'Must include {alert_text}',
  filter: 'Must include {user_rules} and {intent_json}',
}

type Draft = {
  model: string
  system_prompt: string
  user_prompt_template: string
}

function toDraft(row: AdminAgentConfig): Draft {
  return {
    model: row.model,
    system_prompt: row.system_prompt,
    user_prompt_template: row.user_prompt_template,
  }
}

function formatUpdatedAt(iso: string | null): string {
  if (!iso) return 'Never'
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

function AdminAgentsPage() {
  const [agents, setAgents] = useState<AdminAgentConfig[]>([])
  const [drafts, setDrafts] = useState<Record<string, Draft>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingKey, setSavingKey] = useState<AdminAgentKey | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    api
      .adminAgents()
      .then((list) => {
        if (cancelled) return
        setAgents(list)
        const next: Record<string, Draft> = {}
        for (const row of list) {
          next[row.agent_key] = toDraft(row)
        }
        setDrafts(next)
      })
      .catch(() => {
        if (!cancelled) setError('Could not load agent configs')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  function patchDraft(key: AdminAgentKey, patch: Partial<Draft>) {
    setDrafts((prev) => ({
      ...prev,
      [key]: { ...prev[key], ...patch },
    }))
  }

  async function saveAgent(key: AdminAgentKey) {
    const draft = drafts[key]
    if (!draft) return
    setSavingKey(key)
    setError('')
    try {
      const updated = await api.adminUpdateAgent(key, {
        model: draft.model,
        system_prompt: draft.system_prompt,
        user_prompt_template: draft.user_prompt_template,
      })
      setAgents((prev) => prev.map((row) => (row.agent_key === key ? updated : row)))
      setDrafts((prev) => ({ ...prev, [key]: toDraft(updated) }))
    } catch (err) {
      setError(err instanceof Error ? err.message : `Could not save ${key}`)
    } finally {
      setSavingKey(null)
    }
  }

  async function resetAgent(key: AdminAgentKey) {
    setSavingKey(key)
    setError('')
    try {
      const updated = await api.adminUpdateAgent(key, { reset: true })
      setAgents((prev) => prev.map((row) => (row.agent_key === key ? updated : row)))
      setDrafts((prev) => ({ ...prev, [key]: toDraft(updated) }))
    } catch {
      setError(`Could not reset ${key}`)
    } finally {
      setSavingKey(null)
    }
  }

  if (loading) {
    return <p className="text-sm text-[var(--ja-gray-600)]">Loading agents…</p>
  }

  return (
    <div className="admin-fade space-y-6">
      <p className="text-sm text-[var(--ja-gray-600)]">
        Override model and prompts for platform AI agents. Empty overrides fall back to code
        defaults and <code>AI_MODEL</code>.
      </p>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="space-y-6">
        {agents.map((agent) => {
          const draft = drafts[agent.agent_key]
          if (!draft) return null
          const busy = savingKey === agent.agent_key
          return (
            <section key={agent.agent_key} className="feature-item space-y-4 p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-xl font-black capitalize text-[var(--ja-black)]">
                  {agent.agent_key}
                </h2>
                <p className="text-xs text-[var(--ja-gray-600)]">
                  Updated {formatUpdatedAt(agent.updated_at)}
                </p>
              </div>

              <label className="admin-filter-field">
                Model
                <input
                  className="demo-input w-full"
                  value={draft.model}
                  onChange={(e) => patchDraft(agent.agent_key, { model: e.target.value })}
                  spellCheck={false}
                />
              </label>
              <div className="flex flex-wrap gap-2">
                {MODEL_SUGGESTIONS.map((id) => (
                  <button
                    key={id}
                    type="button"
                    className="btn-secondary text-xs"
                    onClick={() => patchDraft(agent.agent_key, { model: id })}
                  >
                    {id}
                  </button>
                ))}
              </div>
              {agent.model_overridden ? (
                <p className="text-xs text-[var(--ja-gray-600)]">
                  Overriding default <code>{agent.default_model}</code>
                </p>
              ) : null}

              <label className="admin-filter-field">
                System prompt
                <textarea
                  className="demo-input min-h-24 w-full font-mono text-xs"
                  value={draft.system_prompt}
                  onChange={(e) =>
                    patchDraft(agent.agent_key, { system_prompt: e.target.value })
                  }
                />
              </label>

              <label className="admin-filter-field">
                User prompt template
                <span className="font-normal text-[var(--ja-gray-600)]">
                  {' '}
                  ({PLACEHOLDER_HINT[agent.agent_key]})
                </span>
                <textarea
                  className="demo-input min-h-36 w-full font-mono text-xs"
                  value={draft.user_prompt_template}
                  onChange={(e) =>
                    patchDraft(agent.agent_key, { user_prompt_template: e.target.value })
                  }
                />
              </label>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="btn-primary"
                  disabled={busy}
                  onClick={() => void saveAgent(agent.agent_key)}
                >
                  {busy ? 'Saving…' : 'Save'}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  disabled={busy}
                  onClick={() => void resetAgent(agent.agent_key)}
                >
                  Reset to defaults
                </button>
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
