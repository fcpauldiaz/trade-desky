import { createFileRoute } from '@tanstack/react-router'

import { sitemapXml } from '#/lib/seo'

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: () =>
        new Response(sitemapXml(new Date().toISOString().slice(0, 10)), {
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
          },
        }),
    },
  },
})
