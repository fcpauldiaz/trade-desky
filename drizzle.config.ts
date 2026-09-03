import { defineConfig } from 'drizzle-kit'

import { resolveDatabaseUrl } from './src/lib/database-url.ts'

export default defineConfig({
  schema: './src/db/auth-schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: resolveDatabaseUrl(),
  },
})
