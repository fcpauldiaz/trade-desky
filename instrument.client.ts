import * as Sentry from '@sentry/tanstackstart-react'

import { normalizeSentryDsn } from '#/lib/sentry-dsn'

declare const __TRADE_SENTRY_DSN__: string

const dsn = normalizeSentryDsn(__TRADE_SENTRY_DSN__)
if (dsn) {
  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    tracesSampleRate: 0,
  })
}
