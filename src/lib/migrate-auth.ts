import { join } from 'node:path'

import { migrate } from 'drizzle-orm/libsql/migrator'

import { db, dbClient } from '#/lib/db'
import { unifyUserTables } from '#/lib/unify-user-tables'

const migrationsFolder =
  process.env.AUTH_MIGRATIONS_DIR ?? join(process.cwd(), 'drizzle')

let migrationPromise: Promise<void> | null = null

export function ensureAuthMigrations(): Promise<void> {
  if (!migrationPromise) {
    migrationPromise = migrate(db, { migrationsFolder }).then(() => unifyUserTables(dbClient))
  }
  return migrationPromise
}
