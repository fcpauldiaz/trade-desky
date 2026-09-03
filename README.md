# Trade Desky

TanStack Start marketing site and logged-in app for broker connections, desktop app sign-in, billing, and performance dashboards.

## Quick start

```bash
cd trade-desky
cp .env.example .env
npm install
npm run dev
```

Also run [trade-receiver](https://github.com/fcpauldiaz/trade-receiver) on port 8000 with local Postgres (`docker compose up -d db` in that repo). Use the **same `DATABASE_URL`** on both services. Set `VITE_RECEIVER_API_URL` and matching `INTERNAL_API_SECRET` on both services.

Alembic in trade-receiver owns the schema, including Better Auth tables. Do not run Drizzle migrate against production.

## Auth

Sign up and log in use **Better Auth** (email + password). Auth lives in the **same PostgreSQL `users` table** as trade-receiver (plus `session` / `account` / `jwks`). On signup, the platform ensures a receiver subscription row via `POST /v1/internal/provision`.

API calls to trade-receiver use a **Better Auth JWT** (`Authorization: Bearer …`), not cookies.

Desktop apps sign in via `POST /api/desktop/auth` and receive a device API key + ingest URL.

### Environment

| Variable | Purpose |
|----------|---------|
| `BETTER_AUTH_SECRET` | Session signing (32+ chars) |
| `BETTER_AUTH_URL` | Public platform URL |
| `DATABASE_URL` | Same PostgreSQL DB as trade-receiver |
| `INTERNAL_API_SECRET` | Must match receiver — provisions users on signup |
| `VITE_RECEIVER_API_URL` | trade-receiver API base |
| `SENTRY_DSN` | Boop/Sentry DSN as `key@domain` — server runtime + Docker build arg for client (tunneled via same-origin route) |

Schema migrations run in trade-receiver (Alembic) on startup.

## Routes

| Route | Description |
|-------|-------------|
| `/` | Marketing landing |
| `/reviews` | Public customer reviews + submit form for paid subscribers |
| `/pricing` | Pro plan (invite-only) |
| `/login`, `/signup` | Email + password (Better Auth) |
| `/dashboard` | P&L calendar + trade table |
| `/connections` | Tradier, Schwab, and NinjaTrader connect + inbound JSON webhook |
| `/onboarding` | Post-connect sizing setup + SPY test order |
| `/settings` | Paper/live, sizing mode, caps, tickers |
| `/billing` | Subscription status |
| `/integrations` | Broker and alert-source overview |
| `/integrations/ninjatrader` | NinjaTrader futures bridge + inbound webhook docs |
| `/guides/ninjatrader` | Step-by-step NinjaTrader bridge setup (Sim101 → live) |

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
| `DATABASE_URL` | `postgresql://…` (same as trade-receiver) |
| `INTERNAL_API_SECRET` | same as trade-receiver |
| `RECEIVER_API_URL` | trade-receiver URL (server-side provisioning) |
| `PORT` | `3000` |

Both apps share one PostgreSQL 18 database. For local dev, start Postgres from trade-receiver (`docker compose up -d db`) and point `DATABASE_URL` at `postgresql://trade:trade@localhost:5432/trade`.

## Tests & CI

```bash
npm run test
npm run build
```

## Design

See `PRODUCT.md` and `DESIGN.md` for impeccable product/brand registers.
