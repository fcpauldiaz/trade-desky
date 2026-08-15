import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'

import { resolveLibsqlConfig } from '#/lib/database-url'

function ensureLocalDatabaseDirectory(url: string): void {
  if (!url.startsWith('file:')) {
    return
  }
  const path = url.slice('file:'.length)
  mkdirSync(dirname(path), { recursive: true })
}

const config = resolveLibsqlConfig()
ensureLocalDatabaseDirectory(config.url)

export const dbClient = createClient({
  url: config.url,
  authToken: config.authToken,
})

export const db = drizzle(dbClient)
