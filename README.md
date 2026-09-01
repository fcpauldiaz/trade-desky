# Trade Desky

TanStack Start marketing site and logged-in app for broker connections, desktop app sign-in, billing, and performance dashboards.

## Quick start

```bash
cd trade-desky
cp .env.example .env
npm install
npm run db:migrate
npm run dev
```

Also run [trade-receiver](https://github.com/fcpauldiaz/trade-receiver) on port 8000. Use the **same `DATABASE_URL`** (and `TURSO_AUTH_TOKEN` when remote) on both services. Set `VITE_RECEIVER_API_URL` and matching `INTERNAL_API_SECRET` on both services.

## Auth

Sign up and log in use **Better Auth** (email + password). Auth lives in the **same libSQL `users` table** as trade-receiver (plus `session` / `account` / `jwks`). On signup, the platform ensures a receiver subscription row via `POST /v1/internal/provision`.

API calls to trade-receiver use a **Better Auth JWT** (`Authorization: Bearer …`), not cookies.

Desktop apps sign in via `POST /api/desktop/auth` and receive a device API key + ingest URL.

### Environment

| Variable | Purpose |
|----------|---------|
| `BETTER_AUTH_SECRET` | Session signing (32+ chars) |
| `BETTER_AUTH_URL` | Public platform URL |
| `DATABASE_URL` | Same libSQL DB as trade-receiver |
| `TURSO_AUTH_TOKEN` | Required when `DATABASE_URL` is `libsql://…` |
| `INTERNAL_API_SECRET` | Must match receiver — provisions users on signup |
| `VITE_RECEIVER_API_URL` | trade-receiver API base |

Auth migrations run automatically on server startup. To apply them manually: `npm run db:migrate`.

## Routes

| Route | Description |
|-------|-------------|
| `/` | Marketing landing |
| `/reviews` | Public customer reviews + submit form for paid subscribers |
| `/pricing` | Pro plan + Creem checkout |
| `/login`, `/signup` | Email + password (Better Auth) |
| `/dashboard` | P&L calendar + trade table |
| `/connections` | Tradier, Schwab, and NinjaTrader connect + inbound JSON webhook |
| `/onboarding` | Post-connect sizing setup + SPY test order |
| `/settings` | Paper/live, sizing mode, caps, tickers |
| `/billing` | Subscription status |
| `/integrations` | Broker and alert-source overview |
| `/integrations/ninjatrader` | NinjaTrader futures bridge + inbound webhook docs |

## Deploy on Coolify (Dockerfile)

Use the repo **Dockerfile** — do not use Nixpacks (it pins Node 22.11, which is too old for TanStack Start).

| Setting | Value |
|---------|--------|
| Build Pack | **Dockerfile** |
| Port | `3000` |
| Start command | leave empty (uses image `CMD`) |

**Build-time variables** (required for client bundle):

| Variable | Example |
|----------|---------|
| `VITE_RECEIVER_API_URL` | `https://api.yourdomain.com` |

**Runtime variables:**

| Variable | Example |
|----------|---------|
| `BETTER_AUTH_SECRET` | 32+ char secret |
| `BETTER_AUTH_URL` | `https://app.yourdomain.com` |
| `DATABASE_URL` | `libsql://your-db-org.turso.io` (same as trade-receiver) |
| `TURSO_AUTH_TOKEN` | Turso auth token (same as trade-receiver) |
| `INTERNAL_API_SECRET` | same as trade-receiver |
| `RECEIVER_API_URL` | trade-receiver URL (server-side provisioning) |
| `PORT` | `3000` |

No separate auth database volume is required when using Turso. For local dev, point `DATABASE_URL` at the receiver SQLite file (see `.env.example`).

## Tests & CI

```bash
npm run test
npm run build
```

## Design

See `PRODUCT.md` and `DESIGN.md` for impeccable product/brand registers.
