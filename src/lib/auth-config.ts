const DEV_BETTER_AUTH_SECRET = 'dev-better-auth-secret-change-in-production'

export type BetterAuthEnv = {
  BETTER_AUTH_SECRET?: string
  BETTER_AUTH_URL?: string
  NODE_ENV?: string
}

export function isLocalhostUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url)
    return (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '[::1]' ||
      hostname === '::1'
    )
  } catch {
    return false
  }
}

export function requiresBetterAuthSecret(
  env: BetterAuthEnv = process.env,
): boolean {
  if (env.NODE_ENV === 'production') {
    return true
  }

  const baseUrl = env.BETTER_AUTH_URL?.trim() || 'http://localhost:3000'
  return !isLocalhostUrl(baseUrl)
}

export function resolveBetterAuthSecret(
  env: BetterAuthEnv = process.env,
): string {
  const secret = env.BETTER_AUTH_SECRET?.trim()
  if (secret) {
    return secret
  }

  if (requiresBetterAuthSecret(env)) {
    throw new Error(
      'BETTER_AUTH_SECRET is required when NODE_ENV=production or BETTER_AUTH_URL points to a non-localhost host. ' +
        'Set a stable secret so JWKS private keys are not encrypted with a dev fallback (which breaks login after redeploy).',
    )
  }

  return DEV_BETTER_AUTH_SECRET
}

export function resolveBetterAuthBaseUrl(
  env: BetterAuthEnv = process.env,
): string {
  return env.BETTER_AUTH_URL?.trim() || 'http://localhost:3000'
}
