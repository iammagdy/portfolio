# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Migrated from Vercel/Next.js to Replit Vite + React.

This is Magdy Saber's 3D portfolio — a creative frontend showcase using React Three Fiber, GSAP, Zustand, and custom 3D models (GLB).

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifacts/portfolio)
- **3D**: React Three Fiber + Three.js + Drei
- **Animation**: GSAP + @gsap/react
- **State management**: Zustand
- **Fonts**: Soria (TTF) + Vercetti (WOFF) — local fonts in public/
- **API framework**: Express 5 (artifacts/api-server). Routes: `/api/healthz`, `/api/devkit/*` (analytics + owner-only stats backed by Hostinger MySQL).
- **Database**: PostgreSQL + Drizzle ORM (not used by portfolio)

## Artifacts

- `artifacts/portfolio` — Main 3D portfolio web app (preview path: `/`, port 21113)
- `artifacts/api-server` — Express backend (preview path: `/api`, port 8080)
- `artifacts/portfolio-mobile` — Expo native portfolio (v1.3.0). Editorial / minimal direction; **no 3D** (three / r3f / expo-gl removed in Task #13). Tabs: Home / Projects / Work / Contact via expo-router with a custom text-only tab bar. System theme on launch + animated cross-fade on toggle (`hooks/useAutoTheme.ts`). Cold-start name-drop intro animation (`components/IntroOverlay.tsx`). Native bottom-sheet for project detail. Monochrome palette + accent (`#d97757` warm light, `#0690d4` cool dark) defined in `constants/colors.ts`. Splash has dark/light variants matching theme.
- `artifacts/portfolio-promo-video` — Promo video artifact.
- `artifacts/mockup-sandbox` — Canvas / mockup preview server.

## Devkit (owner-only analytics)

- Lives at `/devkit` inside the portfolio SPA (App.tsx checks `window.location.pathname`).
- Tracker (`artifacts/portfolio/src/lib/devkitTracker.ts`) sends pageviews, clicks, theme changes, portal open/close, and session_end (via `sendBeacon`) to `POST /api/devkit/events`. Honors `navigator.doNotTrack`, never tracks on `/devkit`, no raw IPs stored — only ISO country code derived server-side from `ipapi.co` (200ms timeout, 24h LRU cache).
- Backend tables auto-create on first DB call (`artifacts/api-server/src/lib/mysql.ts`). **Dual-database adapter** — automatically selects backend at startup:
  - **MySQL** (mysql2, pool 3, keep-alive) when `HOSTINGER_DB_HOST` is set to a non-localhost value → used in production on Hostinger.
  - **PostgreSQL** (pg) via `DATABASE_URL` otherwise → used in Replit dev environment.
  - SQL is written to be cross-compatible; the pg wrapper transparently converts `?` → `$N` placeholders, `INTERVAL ? DAY` → `$N * INTERVAL '1 day'`, and `GROUP_CONCAT(… SEPARATOR …)` → `STRING_AGG(…)`.
- Auth: HMAC-signed httpOnly cookie (`devkit_session`), 30-day expiry. HMAC key derived from `DEVKIT_PASSWORD` via constant salt. Login uses SHA-256 + `timingSafeEqual` for constant-time compare.
- **WebAuthn / Biometric login**: `@simplewebauthn/server` (api-server) + `@simplewebauthn/browser` (portfolio). Routes: `GET /api/devkit/webauthn/status`, `GET /register-options`, `POST /register`, `GET /auth-options`, `POST /authenticate`, `DELETE /passkey`. Passkey stored in `devkit_webauthn` table (auto-created). RP ID/Origin configurable via `WEBAUTHN_RP_ID` + `WEBAUTHN_ORIGIN` env vars (default `magdysaber.com`). Single-passkey model — register replaces any existing credential. Challenges stored in-memory with 5-min TTL. On prod (Hostinger) set `WEBAUTHN_RP_ID=magdysaber.com` and `WEBAUTHN_ORIGIN=https://magdysaber.com`; also ensure `COOKIE_CROSS_SITE=1` since API is at `api.magdysaber.com`.
- Events endpoint enforces a same-origin allowlist (localhost, *.replit.dev/app, magdysaber.com).
- Required Replit secrets: `HOSTINGER_DB_HOST`, `HOSTINGER_DB_PORT`, `HOSTINGER_DB_USER`, `HOSTINGER_DB_PASSWORD`, `HOSTINGER_DB_NAME`, `DEVKIT_PASSWORD`. If absent (or host is localhost), falls back to PostgreSQL. If `DATABASE_URL` also absent, tracker silently no-ops.
- Stats endpoint: `GET /api/devkit/stats?days=N` (auth required) returns totals, fixed today/7d/30d session+visitor windows, daily series, countries (with flag emojis in UI), devices, OSes, browsers, top events across click/theme/portal kinds, avg/max session length, and top referrers. Also `GET /api/devkit/export.csv?days=N` streams raw rows. Rendered with Recharts.
- Schema/API contract note: events table uses normalized columns (`kind`, `target`, `label`, `duration_ms`, `path`, `referrer`, `country`, `device`, `os`, `browser`, `session_id`, `visitor_id`, `ts`) rather than a generic `type` + JSON `event_data` blob. This is intentional — owner-only tool, no external consumers, and normalized columns make the dashboard SQL straightforward. If a third-party ever needs to consume the feed, expose a view that aliases these columns.
- SPA fallback for `/devkit` works via Vite's default history fallback; no extra config needed. Production hosting (Hostinger static + reverse proxy) must serve `index.html` for unknown routes — owner verifies this on deploy.

## Routing

The Replit preview proxy routes by artifact `paths`:
- `/api/*` → api-server (artifacts/api-server/.replit-artifact/artifact.toml `paths = ["/api"]`)
- `/*` → portfolio (artifacts/portfolio/.replit-artifact/artifact.toml `paths = ["/"]`)

This means the portfolio's frontend can call `fetch("/api/...")` directly — no env-driven base URL or Vite proxy is needed in dev or prod. Both artifacts have their own workflows that run independently.

## Contact Link ("Email me")

- The contact entry point lives in the 3D footer alongside LinkedIn and GitHub. It is defined in `artifacts/portfolio/src/constants/footer.ts` as a regular `FooterLink` with a `mailto:contact@magdysaber.com` URL (pre-filled subject and body) and an envelope icon at `public/icons/email.svg`.
- Rendering and hover behavior are handled by `artifacts/portfolio/src/components/footer/index.tsx`. On desktop it renders as 3D text "EMAIL ME" with the same letter-spacing hover animation as the other links; on mobile it renders as the envelope SVG.
- The footer click handler navigates `mailto:` URLs via `window.location.href` (instead of `window.open`) so they reliably open the visitor's default email app. No backend or third-party email service is involved.

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/portfolio run dev` — run portfolio locally

## Path Aliases (portfolio)

- `@/` → `src/`
- `@stores` → `src/stores`
- `@constants` → `src/constants`
- `@types` → `src/types`

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
