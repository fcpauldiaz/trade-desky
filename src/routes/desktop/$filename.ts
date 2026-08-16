import { createFileRoute } from '@tanstack/react-router'

const SAFE_FILENAME = /^[A-Za-z0-9._-]+$/
const RECEIVER_API_URL = (
  process.env.VITE_RECEIVER_API_URL ||
  process.env.RECEIVER_API_URL ||
  'http://localhost:8000'
).replace(/\/$/, '')

export const Route = createFileRoute('/desktop/$filename')({
  server: {
    handlers: {
      GET: async ({ params }: { params: { filename: string } }) => {
        const filename = params.filename
        if (!SAFE_FILENAME.test(filename)) {
          return new Response('Invalid filename', { status: 400 })
        }
        const upstream = await fetch(`${RECEIVER_API_URL}/desktop/${encodeURIComponent(filename)}`)
        if (!upstream.ok) {
          const status = upstream.status === 404 ? 404 : 502
          return new Response(status === 404 ? 'Not found' : 'Upstream error', { status })
        }
        const headers = new Headers()
        const type = upstream.headers.get('content-type')
        if (type) headers.set('Content-Type', type)
        const disposition = upstream.headers.get('content-disposition')
        if (disposition) headers.set('Content-Disposition', disposition)
        headers.set('Cache-Control', upstream.headers.get('cache-control') || 'public, max-age=300')
        return new Response(upstream.body, { status: 200, headers })
      },
    },
  },
})
