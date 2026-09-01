import { defineConfig, loadEnv } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { sentryTanstackStart } from '@sentry/tanstackstart-react/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

import { normalizeSentryDsn } from './sentry-dsn.mjs'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const sentryDsn = normalizeSentryDsn(env.SENTRY_DSN) ?? ''

  return {
    resolve: { tsconfigPaths: true },
    define: {
      __TRADE_SENTRY_DSN__: JSON.stringify(sentryDsn),
    },
    plugins: [
      devtools(),
      nitro({ rollupConfig: { external: [/^@sentry\//] } }),
      tailwindcss(),
      tanstackStart(),
      viteReact(),
      sentryTanstackStart({
        tunnelRoute: true,
        sourcemaps: { disable: true },
        telemetry: false,
      }),
    ],
  }
})
