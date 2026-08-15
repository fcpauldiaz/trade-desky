<!-- intent-skills:start -->
# Skill mappings - load `use` with `npx @tanstack/intent@latest load <use>`.
skills:
  - when: "Install TanStack Devtools, pick framework adapter (React/Vue/Solid/Preact), register plugins via plugins prop, configure shell (position, hotkeys, theme, hideUntilHover, requireUrlFlag, eventBusConfig). TanStackDevtools component, defaultOpen, localStorage persistence."
    use: "@tanstack/devtools#devtools-app-setup"
  - when: "Publish plugin to npm and submit to TanStack Devtools Marketplace. PluginMetadata registry format, plugin-registry.ts, pluginImport (importName, type), requires (packageName, minVersion), framework tagging, multi-framework submissions, featured plugins."
    use: "@tanstack/devtools#devtools-marketplace"
  - when: "Build devtools panel components that display emitted event data. Listen via EventClient.on(), handle theme (light/dark), use @tanstack/devtools-ui components. Plugin registration (name, render, id, defaultOpen), lifecycle (mount, activate, destroy), max 3 active plugins. Two paths: Solid.js core with devtools-ui for multi-framework support, or framework-specific panels."
    use: "@tanstack/devtools#devtools-plugin-panel"
  - when: "Handle devtools in production vs development. removeDevtoolsOnBuild, devDependency vs regular dependency, conditional imports, NoOp plugin variants for tree-shaking, non-Vite production exclusion patterns."
    use: "@tanstack/devtools#devtools-production"
  - when: "Two-way event patterns between devtools panel and application. App-to-devtools observation, devtools-to-app commands, time-travel debugging with snapshots and revert. structuredClone for snapshot safety, distinct event suffixes for observation vs commands, serializable payloads only."
    use: "@tanstack/devtools-event-client#devtools-bidirectional"
  - when: "Create typed EventClient for a library. Define event maps with typed payloads, pluginId auto-prepend namespacing, emit()/on()/onAll()/onAllPluginEvents() API. Connection lifecycle (5 retries, 300ms), event queuing, enabled/disabled state, SSR fallbacks, singleton pattern. Unique pluginId requirement to avoid event collisions."
    use: "@tanstack/devtools-event-client#devtools-event-client"
  - when: "Analyze library codebase for critical architecture and debugging points, add strategic event emissions. Identify middleware boundaries, state transitions, lifecycle hooks. Consolidate events (1 not 15), debounce high-frequency updates, DRY shared payload fields, guard emit() for production. Transparent server/client event bridging."
    use: "@tanstack/devtools-event-client#devtools-instrumentation"
  - when: "Configure @tanstack/devtools-vite for source inspection (data-tsd-source, inspectHotkey, ignore patterns), console piping (client-to-server, server-to-client, levels), enhanced logging, server event bus (port, host, HTTPS), production stripping (removeDevtoolsOnBuild), editor integration (launch-editor, custom editor.open). Must be FIRST plugin in Vite config. Vite ^6 || ^7 only."
    use: "@tanstack/devtools-vite#devtools-vite-plugin"
  - when: "Step-by-step migration from Next.js App Router to TanStack Start: route definition conversion, API mapping, server function conversion from Server Actions, middleware conversion, data fetching pattern changes."
    use: "@tanstack/react-start#lifecycle/migrate-from-nextjs"
  - when: "React bindings for TanStack Start: createStart, StartClient, StartServer, React-specific imports, re-exports from @tanstack/react-router, full project setup with React, useServerFn hook."
    use: "@tanstack/react-start#react-start"
  - when: "Implement, review, debug, and refactor TanStack Start React Server Components in React 19 apps. Use when tasks mention @tanstack/react-start/rsc, renderServerComponent, createCompositeComponent, CompositeComponent, renderToReadableStream, createFromReadableStream, createFromFetch, Composite Components, React Flight streams, loader or query owned RSC caching, router.invalidate, structuralSharing: false, selective SSR, stale names like renderRsc or .validator, or migration from Next App Router RSC patterns. Do not use for generic SSR or non-TanStack RSC frameworks except brief comparison."
    use: "@tanstack/react-start#react-start/server-components"
  - when: "Framework-agnostic core concepts for TanStack Router: route trees, createRouter, createRoute, createRootRoute, createRootRouteWithContext, addChildren, Register type declaration, route matching, route sorting, file naming conventions. Entry point for all router skills."
    use: "@tanstack/router-core#router-core"
  - when: "Route protection with beforeLoad, redirect()/throw redirect(), isRedirect helper, authenticated layout routes (_authenticated), non-redirect auth (inline login), RBAC with roles and permissions, auth provider integration (Auth0, Clerk, Supabase), router context for auth state."
    use: "@tanstack/router-core#router-core/auth-and-guards"
  - when: "Automatic code splitting (autoCodeSplitting), .lazy.tsx convention, createLazyFileRoute, createLazyRoute, lazyRouteComponent, getRouteApi for typed hooks in split files, codeSplitGroupings per-route override, splitBehavior programmatic config, critical vs non-critical properties."
    use: "@tanstack/router-core#router-core/code-splitting"
  - when: "Route loader option, loaderDeps for cache keys, staleTime/gcTime/ defaultPreloadStaleTime SWR caching, pendingComponent/pendingMs/ pendingMinMs, errorComponent/onError/onCatch, beforeLoad, router context and createRootRouteWithContext DI pattern, router.invalidate, Await component, deferred data loading with unawaited promises."
    use: "@tanstack/router-core#router-core/data-loading"
  - when: "Link component, useNavigate, Navigate component, router.navigate, ToOptions/NavigateOptions/LinkOptions, from/to relative navigation, activeOptions/activeProps, preloading (intent/viewport/render), preloadDelay, navigation blocking (useBlocker, Block), createLink, linkOptions helper, scroll restoration, MatchRoute."
    use: "@tanstack/router-core#router-core/navigation"
  - when: "notFound() function, notFoundComponent, defaultNotFoundComponent, notFoundMode (fuzzy/root), errorComponent, CatchBoundary, CatchNotFound, isNotFound, NotFoundRoute (deprecated), route masking (mask option, createRouteMask, unmaskOnReload)."
    use: "@tanstack/router-core#router-core/not-found-and-errors"
  - when: "Dynamic path segments ($paramName), splat routes ($ / _splat), optional params ({-$paramName}), prefix/suffix patterns ({$param}.ext), useParams, params.parse/stringify, pathParamsAllowedCharacters, i18n locale patterns."
    use: "@tanstack/router-core#router-core/path-params"
  - when: "validateSearch, search param validation with Zod/Valibot/ArkType adapters, fallback(), search middlewares (retainSearchParams, stripSearchParams), custom serialization (parseSearch, stringifySearch), search param inheritance, loaderDeps for cache keys, reading and writing search params."
    use: "@tanstack/router-core#router-core/search-params"
  - when: "Non-streaming and streaming SSR, RouterClient/RouterServer, renderRouterToString/renderRouterToStream, createRequestHandler, defaultRenderHandler/defaultStreamHandler, HeadContent/Scripts components, head route option (meta/links/styles/scripts), ScriptOnce, automatic loader dehydration/hydration, memory history on server, data serialization, document head management."
    use: "@tanstack/router-core#router-core/ssr"
  - when: "Full type inference philosophy (never cast, never annotate inferred values), Register module declaration, from narrowing on hooks and Link, strict:false for shared components, getRouteApi for code-split typed access, addChildren with object syntax for TS perf, LinkProps and ValidateLinkOptions type utilities, as const satisfies pattern."
    use: "@tanstack/router-core#router-core/type-safety"
  - when: "TanStack Router bundler plugin for route generation and automatic code splitting. Supports Vite, Webpack, Rspack, and esbuild. Configures autoCodeSplitting, routesDirectory, target framework, and code split groupings."
    use: "@tanstack/router-plugin#router-plugin"
  - when: "Core overview for TanStack Start: tanstackStart() Vite plugin, getRouter() factory, root route document shell (HeadContent, Scripts, Outlet), client/server entry points, routeTree.gen.ts, tsconfig configuration. Entry point for all Start skills."
    use: "@tanstack/start-client-core#start-core"
  - when: "Server-side authentication primitives for TanStack Start: session cookies (HttpOnly, Secure, SameSite, __Host- prefix), session read/issue/destroy via createServerFn and middleware, OAuth authorization-code flow with state and PKCE, password-reset enumeration defense, CSRF for non-GET RPCs, rate limiting auth endpoints, session rotation on privilege change. Pairs with router-core/auth-and-guards for the routing side."
    use: "@tanstack/start-client-core#start-core/auth-server-primitives"
  - when: "Deploy to Cloudflare Workers, Netlify, Vercel, Node.js/Docker, Bun, Railway. Selective SSR (ssr option per route), SPA mode, static prerendering, ISR with Cache-Control headers, SEO and head management."
    use: "@tanstack/start-client-core#start-core/deployment"
  - when: "Isomorphic-by-default principle, environment boundary functions (createServerFn, createServerOnlyFn, createClientOnlyFn, createIsomorphicFn), ClientOnly component, useHydrated hook, import protection, dead code elimination, environment variable safety (VITE_ prefix, process.env)."
    use: "@tanstack/start-client-core#start-core/execution-model"
  - when: "createMiddleware, request middleware (.server only), server function middleware (.client + .server), context passing via next({ context }), sendContext for client-server transfer, global middleware via createStart in src/start.ts, middleware factories, method order enforcement, fetch override precedence."
    use: "@tanstack/start-client-core#start-core/middleware"
  - when: "createServerFn (GET/POST), validator (Zod or function), useServerFn hook, server context utilities (getRequest, getRequestHeader, setResponseHeader, setResponseStatus), error handling (throw errors, redirect, notFound), streaming, FormData handling, file organization (.functions.ts, .server.ts)."
    use: "@tanstack/start-client-core#start-core/server-functions"
  - when: "Server-side API endpoints using the server property on createFileRoute, HTTP method handlers (GET, POST, PUT, DELETE), createHandlers for per-handler middleware, handler context (request, params, context), request body parsing, response helpers, file naming for API routes."
    use: "@tanstack/start-client-core#start-core/server-routes"
  - when: "Server-side runtime for TanStack Start: createStartHandler, request/response utilities (getRequest, setResponseHeader, setCookie, getCookie, useSession), three-phase request handling, AsyncLocalStorage context."
    use: "@tanstack/start-server-core#start-server-core"
  - when: "Programmatic route tree building as an alternative to filesystem conventions: rootRoute, index, route, layout, physical, defineVirtualSubtreeConfig. Use with TanStack Router plugin's virtualRouteConfig option."
    use: "@tanstack/virtual-file-routes#virtual-file-routes"
<!-- intent-skills:end -->

# Trade Desky — Agent Guide

## Design system (JobAlert-inspired)

Reference site: [jobalert.world](https://jobalert.world). The product uses a **light-only**, **neo-brutalist** UI: white/gray backgrounds, **yellow (`#facc15`) + black borders**, hard offset shadows (`4px 4px 0 #000`), **Inter** font, `font-weight: 900` headlines.

**Do not** reintroduce dark mode, lagoon/teal gradients, Fraunces serif, or glassmorphism.

### Global (all routes)

- `src/styles.css` — design tokens and component classes
- `src/routes/__root.tsx` — forces `light` theme; shared header/footer
- `src/components/Header.tsx`, `src/components/Footer.tsx` — JobAlert-style chrome

CSS variables (also aliased for legacy code):

| Token | Value / role |
|-------|----------------|
| `--ja-yellow` | Primary CTA / highlights |
| `--ja-pink` | Secondary highlight underline |
| `--ja-black` | Borders, headline text |
| `--ja-gray-600` | Muted body copy |
| `--lagoon-deep` | Alias → yellow (legacy buttons still work) |

### Use these classes for new marketing / public UI

| Class | Use |
|-------|-----|
| `marketing-page` | Public page wrapper (white bg) |
| `marketing-section`, `section-head`, `section-badge` | Content sections |
| `btn-primary`, `btn-secondary`, `btn-black` | CTAs (yellow + black border + shadow) |
| `feature-item` | Bordered cards |
| `hero-highlight` + `HeroHighlight` | Title marker underlines (yellow/pink) |
| `SocialProof` | “Join N+ traders!” bar (live count) |
| `demo-input`, `demo-button` | Forms on auth pages |

Marketing components live in `src/components/marketing/`.

### Style coverage by route

| Route | Status | Notes |
|-------|--------|-------|
| `/` | **Full** | Hero, features, FAQ, social proof, CTA band |
| `/pricing` | **Full** | `marketing-page`, pricing cards, `btn-primary` |
| `/login`, `/signup` | **Full** | `marketing-page`, `feature-item` forms |
| `/reviews`, `/support` | **Full** | Marketing headers and cards |
| `/privacy`, `/terms` | **Partial** | Plain `prose` only — not yet neo-brutalist |
| `/dashboard` | **Partial** | `island-shell` cards; generic headings; inline Tailwind buttons |
| `/connections`, `/settings`, `/billing` | **Partial** | Same as dashboard |
| `/onboarding` | **Partial** | `island-shell`; old `rounded-full bg-[var(--lagoon-deep)]` buttons |

When touching **app/authenticated pages**, prefer migrating to `btn-primary`, `feature-item`, and `marketing-page-header` for consistency.

### Hero title pattern

Use `HeroHighlight` (`src/components/marketing/HeroHighlight.tsx`), not CSS `::after`:

```tsx
<HeroHighlight variant="yellow">broker orders</HeroHighlight>
<HeroHighlight variant="pink">automatically</HeroHighlight>
```

Underline = thick absolute bar (`height: 1rem`), rotated ±1deg, text on `z-index: 1`.

### Social proof

- Component: `src/components/marketing/SocialProof.tsx`
- Fetches `GET {VITE_RECEIVER_API_URL}/v1/stats/public` → `{ user_count }`
- Formatting: `src/lib/public-stats.ts` (`formatSocialProofCount`)
- Hidden when count is 0 or API fails
- **Requires trade-receiver deployed** with stats endpoint

### Auth & data (not visual)

- Better Auth + shared Turso DB with trade-receiver
- Desktop ingest via device token; no per-user webhook URLs
- Receiver API client: `src/lib/api-client.ts`

### Outdated docs

`DESIGN.md` still describes the old lagoon palette — treat **this file** and `src/styles.css` as source of truth for UI work.

## Cursor Cloud specific instructions

Single-product **TanStack Start** app (React 19 + Vite/Nitro SSR). Package manager is **npm** (`package-lock.json`); do **not** use pnpm even though `package.json` has a `pnpm.onlyBuiltDependencies` block. Standard commands live in `package.json` and `README.md`: `npm run dev` (port 3000), `npm run test` (vitest), `npm run build`, `npm run db:migrate`.

The VM update script runs `npm install`. The app runs with sane local defaults **without a `.env`**: `DATABASE_URL` falls back to `file:./data/trade.db`, the Better Auth secret falls back to a dev default, and **auth migrations run automatically on server startup** (`ensureAuthMigrations()` in `src/lib/auth.server.ts`). A `.env` is only needed to point at a real `trade-receiver`/Turso DB or override secrets.

Non-obvious gotchas:
- `npm run db:migrate` (drizzle-kit) fails with `Unable to open connection ... 14` if `./data/` does not exist — run `mkdir -p data` first. The runtime `src/lib/db.ts` auto-creates that dir, but drizzle-kit does not. Because migrations auto-run at server startup, `db:migrate` is optional for dev.
- Authenticated features depend on the **external `trade-receiver` API on port 8000** (separate repo `github.com/fcpauldiaz/trade-receiver`, not in this repo). Without it: marketing pages work; **signup returns 500 because the Better Auth `user.create.after` provision hook (`src/lib/provision-receiver.ts`) can't reach the receiver — note the user row is still persisted before the hook throws**; dashboard/billing/trades calls fail gracefully with inline error text; social proof hides. To exercise the full signup + dashboard flow without the real receiver, run a small local stub that returns `200` for `POST /v1/internal/provision` and JSON for the `/v1/me*`, `/v1/reviews`, and `/v1/stats/public` read endpoints on port 8000.
- `npm run test` prints a harmless Vitest 4 teardown warning (`module is not defined` / `close timed out`) after `Tests ... passed`; exit code is still 0.
