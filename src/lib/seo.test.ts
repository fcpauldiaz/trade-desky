import { describe, expect, it } from 'vitest'

import { INDEXABLE_PATHS, LLMS_SECTIONS, llmsTxt, pageHead, pageTitle, sitemapXml } from '#/lib/seo'
import { SITE_URL, canonicalUrl } from '#/lib/site'

describe('seo helpers', () => {
  it('keeps Trade Desky in the title once', () => {
    expect(pageTitle('Trade Desky pricing')).toBe('Trade Desky pricing')
    expect(pageTitle('Pricing')).toBe('Pricing | Trade Desky')
  })

  it('sets unique title, description, canonical, and robots', () => {
    const head = pageHead({
      title: 'Pricing',
      description: 'Pro is $19.99 per month.',
      path: '/pricing',
    })
    expect(head.meta).toEqual(
      expect.arrayContaining([
        { title: 'Pricing | Trade Desky' },
        { name: 'description', content: 'Pro is $19.99 per month.' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:url', content: `${SITE_URL}/pricing` },
      ]),
    )
    expect(head.links).toEqual([{ rel: 'canonical', href: `${SITE_URL}/pricing` }])
  })

  it('marks app pages noindex', () => {
    const head = pageHead({
      title: 'Log in',
      description: 'Sign in to Trade Desky.',
      path: '/login',
      index: false,
    })
    expect(head.meta).toEqual(
      expect.arrayContaining([{ name: 'robots', content: 'noindex, nofollow' }]),
    )
  })

  it('builds a sitemap for every indexable path', () => {
    const xml = sitemapXml('2026-08-15')
    expect(xml).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')
    for (const path of INDEXABLE_PATHS) {
      expect(xml).toContain(`<loc>${canonicalUrl(path)}</loc>`)
    }
    expect(xml.match(/<url>/g)?.length).toBe(INDEXABLE_PATHS.length)
  })

  it('lists every indexable path in llms.txt', () => {
    const listed = LLMS_SECTIONS.flatMap((section) => section.links.map((link) => link.path))
    expect([...listed].sort()).toEqual([...INDEXABLE_PATHS].sort())

    const body = llmsTxt()
    expect(body.startsWith('# Trade Desky\n')).toBe(true)
    for (const path of INDEXABLE_PATHS) {
      expect(body).toContain(canonicalUrl(path))
    }
  })
})
