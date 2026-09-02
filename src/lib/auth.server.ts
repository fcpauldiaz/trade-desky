import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { betterAuth } from 'better-auth'
import { jwt } from 'better-auth/plugins'
import { tanstackStartCookies } from 'better-auth/tanstack-start'

import * as authSchema from '#/db/auth-schema'
import {
  resolveBetterAuthBaseUrl,
  resolveBetterAuthSecret,
} from '#/lib/auth-config'
import { db } from '#/lib/db'
import { ensureAuthMigrations } from '#/lib/migrate-auth'
import { provisionReceiverUser } from '#/lib/provision-receiver'

await ensureAuthMigrations()

export const auth = betterAuth({
  baseURL: resolveBetterAuthBaseUrl(),
  secret: resolveBetterAuthSecret(),
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema: authSchema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    jwt({
      jwt: {
        definePayload: ({ user }) => ({
          sub: user.id,
          email: user.email,
          name: user.name,
        }),
        expirationTime: '1h',
      },
    }),
    tanstackStartCookies(),
  ],
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await provisionReceiverUser({
            id: user.id,
            email: user.email,
            name: user.name,
          })
        },
      },
    },
  },
})
