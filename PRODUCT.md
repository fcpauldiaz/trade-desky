# Trade Desky — Product Register

## Audience
Active options traders who follow Discord alert channels and want automated execution with guardrails.

## Core jobs
1. Subscribe and connect a broker
2. Sign in to the Notification Watcher desktop app
3. Monitor P&L and trade history on the dashboard

## Information hierarchy (dashboard)
1. Monthly P&L calendar (primary)
2. KPI strip (MTD P&L, win rate, trade count, paper/live filter)
3. Trade table (secondary, sortable)

## Gating
- Free: marketing, signup, view empty dashboard with upgrade CTA
- Pro: desktop app automation, broker connections, trade processing

## Pages
| Route | Purpose |
|-------|---------|
| `/` | Marketing |
| `/pricing` | Creem checkout |
| `/dashboard` | Performance |
| `/connections` | Broker OAuth |
| `/settings` | Paper/live, caps, tickers |
| `/billing` | Subscription management |

## API dependency
All authenticated data comes from `trade-receiver` REST API (`VITE_RECEIVER_API_URL`).

Desktop apps authenticate via `POST /api/desktop/auth` and send alerts to `POST /v1/ingest` on trade-receiver.
