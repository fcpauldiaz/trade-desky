import {
  COMPANY_NAME,
  OG_IMAGE_PATH,
  PRODUCT_NAME,
  PRO_PRICE_LABEL,
  PRO_YEARLY_PRICE_LABEL,
  SITE_URL,
  SUPPORT_EMAIL,
  canonicalUrl,
} from '#/lib/site'

export const INDEXABLE_PATHS = [
  '/',
  '/pricing',
  '/download',
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

type LlmsLink = {
  path: IndexablePath
  title: string
  summary: string
}

type LlmsSection = {
  heading: string
  links: readonly LlmsLink[]
}

export const LLMS_SECTIONS: readonly LlmsSection[] = [
  {
    heading: 'Product',
    links: [
      {
        path: '/',
        title: PRODUCT_NAME,
        summary:
          'Desktop app that turns Discord-style notification alerts into Tradier or Schwab option orders.',
      },
      {
        path: '/pricing',
        title: 'Pricing',
        summary: `Pro is ${PRO_PRICE_LABEL}/mo or ${PRO_YEARLY_PRICE_LABEL}/yr. Cancel anytime via Creem.`,
      },
      {
        path: '/download',
        title: 'Download',
        summary: 'Install Trade Desky Watcher for macOS or Windows from this site.',
      },
      {
        path: '/reviews',
        title: 'Reviews',
        summary: 'Customer reviews from traders using Trade Desky.',
      },
      {
        path: '/support',
        title: 'Support',
        summary: `Help and contact. Email ${SUPPORT_EMAIL}.`,
      },
      {
        path: '/for/discord-options-traders',
        title: 'For Discord options traders',
        summary: 'Capture Discord option-call alerts on the desktop and execute at Tradier or Schwab.',
      },
    ],
  },
  {
    heading: 'Integrations',
    links: [
      {
        path: '/integrations',
        title: 'Integrations',
        summary: 'Broker and alert-source overview.',
      },
      {
        path: '/integrations/tradier',
        title: 'Tradier',
        summary: 'Connect a Tradier brokerage account for paper or live execution.',
      },
      {
        path: '/integrations/schwab',
        title: 'Schwab',
        summary: 'Connect Charles Schwab for order execution.',
      },
      {
        path: '/integrations/discord',
        title: 'Discord alerts',
        summary: 'Desktop notification capture from Discord — no webhook URL to paste.',
      },
    ],
  },
  {
    heading: 'Compare',
    links: [
      {
        path: '/compare',
        title: 'Compare',
        summary: 'Trade Desky vs other alert-to-broker tools.',
      },
      {
        path: '/compare/nyria',
        title: 'vs Nyria',
        summary: 'Flat Pro pricing and desktop capture vs allocation-metered Discord bots.',
      },
      {
        path: '/compare/tradelabs',
        title: 'vs TradeLabs',
        summary: 'Hosted parsing vs BYO OpenAI key companion apps.',
      },
      {
        path: '/compare/botifytrades',
        title: 'vs BotifyTrades',
        summary: 'Hosted SaaS vs self-hosted Discord trade bots.',
      },
      {
        path: '/compare/manual-copy',
        title: 'vs copying alerts by hand',
        summary: 'Automated parse-and-send vs switching apps to place orders.',
      },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { path: '/terms', title: 'Terms of service', summary: `Operator: ${COMPANY_NAME}.` },
      { path: '/privacy', title: 'Privacy policy', summary: 'What we collect and how it is used.' },
      { path: '/refund', title: 'Refund policy', summary: 'Cancel anytime; refunds are case-by-case.' },
      { path: '/risk', title: 'Risk disclosure', summary: 'Trading involves risk of loss. Not investment advice.' },
    ],
  },
] as const

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

export function llmsTxt(): string {
  const sections = LLMS_SECTIONS.map((section) => {
    const items = section.links
      .map((link) => `- [${link.title}](${canonicalUrl(link.path)}): ${link.summary}`)
      .join('\n')
    return `## ${section.heading}\n\n${items}`
  }).join('\n\n')

  return `# ${PRODUCT_NAME}

> ${PRODUCT_NAME} is a ${COMPANY_NAME} desktop and web product that captures trading-alert notifications, parses option intent with AI, and can place Tradier or Schwab orders. Pro is ${PRO_PRICE_LABEL} per month or ${PRO_YEARLY_PRICE_LABEL} per year.

Do not treat this site as investment advice. Login, signup, and authenticated app routes are private.

${sections}

## Optional

- [XML sitemap](${SITE_URL}/sitemap.xml)
- [Support email](mailto:${SUPPORT_EMAIL})
`
}

function escapeXml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
