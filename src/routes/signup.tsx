import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { signUp } from '#/lib/auth-client'

export const Route = createFileRoute('/signup')({ component: SignupPage })

function SignupPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const result = await signUp.email({ email, password, name })
    if (result.error) {
      setError(result.error.message || 'Signup failed')
      return
    }
    navigate({ to: '/pricing' })
  }

  return (
    <main className="marketing-page page-wrap px-4 py-12">
      <header className="marketing-page-header">
        <h1>Sign up</h1>
        <p>Create your account and connect your broker when you are ready.</p>
      </header>
      <form onSubmit={onSubmit} className="feature-item mx-auto max-w-md space-y-4">
        <label className="block text-sm">
          Name
          <input
            name="name"
            type="text"
            autoComplete="name"
            className="demo-input mt-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          Email
          <input
            name="email"
            type="email"
            autoComplete="email"
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
            autoComplete="new-password"
            className="demo-input mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="btn-primary w-full">
          Create account
        </button>
      </form>
    </main>
  )
}
