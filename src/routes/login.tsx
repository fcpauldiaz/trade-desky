import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { api } from '#/lib/api-client'
import { signIn } from '#/lib/auth-client'
import { postLoginPath } from '#/lib/onboarding-funnel'
import { noindexHead } from '#/lib/seo'

export const Route = createFileRoute('/login')({
  head: () => noindexHead('Log in', 'Sign in to your Trade Desky account.'),
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const result = await signIn.email({ email, password })
    if (result.error) {
      setError(result.error.message || 'Invalid email or password')
      return
    }
    try {
      const me = await api.me()
      navigate({ to: postLoginPath(me.can_process_trades) })
    } catch {
      navigate({ to: '/dashboard' })
    }
  }

  return (
    <main className="marketing-page page-wrap px-4 py-12">
      <header className="marketing-page-header">
        <h1>Log in</h1>
        <p>Access your dashboard, connections, and billing.</p>
      </header>
      <form onSubmit={onSubmit} className="feature-item mx-auto max-w-md space-y-4">
        <label className="block text-sm">
          Email
          <input
            name="email"
            type="email"
            autoComplete="username"
            className="demo-input mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="block text-sm">
          Password
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            className="demo-input mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="btn-primary w-full">
          Log in
        </button>
      </form>
    </main>
  )
}
