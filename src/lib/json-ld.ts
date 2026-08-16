import { COMPANY_NAME, PRODUCT_NAME, PRO_PRICE_USD, PRO_YEARLY_PRICE_USD, SITE_URL, SUPPORT_EMAIL, canonicalUrl } from '#/lib/site'
import type { IndexablePath } from '#/lib/seo'

export type FaqItem = {
  q: string
  a: string
}

export const HOME_FAQ: readonly FaqItem[] = [
  {
    q: 'Why use Trade Desky instead of copying alerts manually?',
    a: 'The desktop app captures notifications as they arrive, AI parses the trade intent, and your broker can execute before you finish switching apps.',
  },
  {
    q: 'Do I need to configure a webhook URL?',
    a: 'No. Sign in on macOS or Windows with the same account as the web app. The desktop client connects to our ingest endpoint automatically.',
  },
  {
    q: 'Which brokers are supported?',
    a: 'Tradier and Schwab today. Connect from the Connections page, complete onboarding, then run paper or live trades from your dashboard.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Manage billing from your account. When a subscription lapses, automated execution stops until you resubscribe.',
  },
]

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: PRODUCT_NAME,
    url: SITE_URL,
    email: SUPPORT_EMAIL,
    parentOrganization: {
      '@type': 'Organization',
      name: COMPANY_NAME,
    },
  }
}

export function softwareApplicationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: PRODUCT_NAME,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'macOS, Windows, Web',
    url: SITE_URL,
    offers: [
      {
        '@type': 'Offer',
        name: 'Pro Monthly',
        price: PRO_PRICE_USD.toFixed(2),
        priceCurrency: 'USD',
      },
      {
        '@type': 'Offer',
        name: 'Pro Yearly',
        price: PRO_YEARLY_PRICE_USD.toFixed(2),
        priceCurrency: 'USD',
      },
    ],
    description:
      'Desktop app that turns Discord-style notification alerts into Tradier or Schwab option orders.',
  }
}

export function faqPageJsonLd(faq: readonly FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  }
}

export function breadcrumbJsonLd(items: readonly { name: string; path: IndexablePath | '/' }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  }
}
