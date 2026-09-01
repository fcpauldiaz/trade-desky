import * as Sentry from '@sentry/tanstackstart-react'

import { normalizeSentryDsn } from './sentry-dsn.mjs'

const dsn = normalizeSentryDsn(process.env.SENTRY_DSN)
if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV ?? 'development',
    tracesSampleRate: 0,
  })
}
