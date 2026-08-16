import { OG_IMAGE_PATH, PRODUCT_NAME, SITE_URL, canonicalUrl } from '#/lib/site'

export const INDEXABLE_PATHS = [
  '/',
  '/pricing',
  '/reviews',
  '/support',
  '/privacy',
  '/terms',
  '/refund',
  '/risk',
  '/integrations',
  '/integrations/tradier',
  '/integrations/schwab',
  '/integrations/discord',
  '/compare',
  '/compare/nyria',
  '/compare/tradelabs',
  '/compare/botifytrades',
  '/compare/manual-copy',
  '/for/discord-options-traders',
] as const

export type IndexablePath = (typeof INDEXABLE_PATHS)[number]

type PageHeadInput = {
  title: string
  description: string
  path: string
  index?: boolean
}

export function pageTitle(title: string): string {
  return title.includes(PRODUCT_NAME) ? title : `${title} | ${PRODUCT_NAME}`
}

export function pageHead({ title, description, path, index = true }: PageHeadInput) {
  const url = canonicalUrl(path)
  const fullTitle = pageTitle(title)
  const image = `${SITE_URL}${OG_IMAGE_PATH}`
  return {
    meta: [
      { title: fullTitle },
      { name: 'description', content: description },
      { name: 'robots', content: index ? 'index, follow' : 'noindex, nofollow' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: PRODUCT_NAME },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
      { property: 'og:image', content: image },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
    ],
    links: [{ rel: 'canonical', href: url }],
  }
}

export function noindexHead(title: string, description: string) {
  return {
    meta: [
      { title: pageTitle(title) },
      { name: 'description', content: description },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }
}

export function sitemapXml(lastmod: string, paths: readonly string[] = INDEXABLE_PATHS): string {
  const urls = paths
    .map(
      (path) => `  <url>
    <loc>${escapeXml(canonicalUrl(path))}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`,
    )
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
}

function escapeXml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
