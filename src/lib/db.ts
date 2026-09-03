import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { resolveDatabaseUrl } from '#/lib/database-url'

const url = resolveDatabaseUrl()

export const dbClient = postgres(url, { max: 10 })
export const db = drizzle(dbClient)
