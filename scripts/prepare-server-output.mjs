import { copyFileSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const serverDir = join(root, '.output/server')
const serverPkgPath = join(serverDir, 'package.json')

const rootPkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
const serverPkg = JSON.parse(readFileSync(serverPkgPath, 'utf8'))

const runtimeExternals = ['@sentry/tanstackstart-react']

for (const dep of runtimeExternals) {
  const version = rootPkg.dependencies?.[dep]
  if (!version) {
    throw new Error(`Missing root dependency for server runtime: ${dep}`)
  }
  serverPkg.dependencies[dep] = version
}

writeFileSync(serverPkgPath, `${JSON.stringify(serverPkg, null, 2)}\n`)

for (const file of ['instrument.server.mjs', 'sentry-dsn.mjs']) {
  copyFileSync(join(root, file), join(serverDir, file))
}
