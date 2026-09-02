import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const serverDir = join(process.cwd(), '.output/server')

describe('server runtime output', () => {
  it('includes Sentry in traced server package.json', () => {
    const pkg = JSON.parse(
      readFileSync(join(serverDir, 'package.json'), 'utf8'),
    ) as { dependencies?: Record<string, string> }

    expect(pkg.dependencies?.['@sentry/tanstackstart-react']).toBeTruthy()
  })

  it('copies Sentry instrumentation files into server output', () => {
    for (const file of ['instrument.server.mjs', 'sentry-dsn.mjs']) {
      expect(() => readFileSync(join(serverDir, file), 'utf8')).not.toThrow()
    }
  })
})
