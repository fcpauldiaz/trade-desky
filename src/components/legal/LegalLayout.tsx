import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'

import { COMPANY_NAME, LEGAL_UPDATED, PRODUCT_NAME, SUPPORT_EMAIL } from '#/lib/site'

const LINKS = [
  { to: '/terms', label: 'Terms' },
  { to: '/privacy', label: 'Privacy' },
  { to: '/refund', label: 'Refunds' },
  { to: '/risk', label: 'Risk' },
] as const

export default function LegalLayout({
  title,
  summary,
  children,
}: {
  title: string
  summary: string
  children: ReactNode
}) {
  return (
    <main className="marketing-page page-wrap max-w-2xl px-4 py-10">
      <header className="marketing-page-header">
        <h1>{title}</h1>
        <p>{summary}</p>
        <p className="mt-2 text-sm text-[var(--ja-gray-600)]">
          Last updated {LEGAL_UPDATED}. {COMPANY_NAME} operates {PRODUCT_NAME}.
        </p>
      </header>
      <nav className="mb-8 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold" aria-label="Legal">
        {LINKS.map((link) => (
          <Link key={link.to} to={link.to} className="underline">
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="prose prose-sm">{children}</div>
      <p className="mt-10 text-sm text-[var(--ja-gray-600)]">
        Questions:{' '}
        <a className="font-semibold text-[var(--ja-black)] underline" href={`mailto:${SUPPORT_EMAIL}`}>
          {SUPPORT_EMAIL}
        </a>
      </p>
    </main>
  )
}
