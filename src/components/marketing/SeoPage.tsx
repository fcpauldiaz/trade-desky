import type { ReactNode } from 'react'

import FinalCta from '#/components/marketing/FinalCta'
import JsonLd from '#/components/JsonLd'

export default function SeoPage({
  title,
  lede,
  jsonLd,
  children,
}: {
  title: string
  lede: string
  jsonLd?: object | readonly object[]
  children: ReactNode
}) {
  return (
    <main className="marketing-page">
      {jsonLd ? <JsonLd data={jsonLd} /> : null}
      <section className="marketing-section marketing-section-white">
        <div className="page-wrap px-4 sm:px-6 lg:px-8">
          <header className="marketing-page-header">
            <h1>{title}</h1>
            <p>{lede}</p>
          </header>
          <div className="seo-content space-y-6">{children}</div>
        </div>
      </section>
      <FinalCta />
    </main>
  )
}

export function SeoSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="feature-item space-y-3">
      <h2 className="text-xl font-black">{title}</h2>
      {children}
    </article>
  )
}

export function RelatedPages({
  links,
}: {
  links: ReadonlyArray<{ to: string; label: string }>
}) {
  return (
    <nav className="feature-item space-y-3" aria-label="Related pages">
      <h2 className="text-xl font-black">Related</h2>
      <ul className="list-disc space-y-2 pl-5 text-sm">
        {links.map((link) => (
          <li key={link.to}>
            <a href={link.to} className="font-semibold underline">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
