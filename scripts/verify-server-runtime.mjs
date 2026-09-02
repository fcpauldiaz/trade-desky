import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const serverDir = join(import.meta.dirname, '../.output/server')

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

const pkg = JSON.parse(
  readFileSync(join(serverDir, 'package.json'), 'utf8'),
)

assert(
  pkg.dependencies?.['@sentry/tanstackstart-react'],
  'Missing @sentry/tanstackstart-react in .output/server/package.json',
)

for (const file of ['instrument.server.mjs', 'sentry-dsn.mjs']) {
  readFileSync(join(serverDir, file), 'utf8')
}

console.log('Server runtime output verified')
