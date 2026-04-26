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
- **API framework**: Express 5 (artifacts/api-server, serves /api/contact)
- **Database**: PostgreSQL + Drizzle ORM (not used by portfolio)
- **Email**: Resend (transactional email for contact form)

## Artifacts

- `artifacts/portfolio` — Main 3D portfolio web app (preview path: `/`, port 21113)
- `artifacts/api-server` — Express backend (preview path: `/api`, port 8080)

## Routing

The Replit preview proxy routes by artifact `paths`:
- `/api/*` → api-server (artifacts/api-server/.replit-artifact/artifact.toml `paths = ["/api"]`)
- `/*` → portfolio (artifacts/portfolio/.replit-artifact/artifact.toml `paths = ["/"]`)

This means the portfolio's frontend can call `fetch("/api/contact")` directly — no env-driven base URL or Vite proxy is needed in dev or prod. Both artifacts have their own workflows that run independently.

## Contact Form

- Component: `artifacts/portfolio/src/components/common/ContactForm.tsx` (modal) + `ContactButton.tsx` (right-edge pill trigger)
- Endpoint: `POST /api/contact` in `artifacts/api-server/src/routes/contact.ts`
- Email provider: Resend (HTTP API). Required env: `RESEND_API_KEY`. Optional: `CONTACT_FROM_EMAIL` (defaults to `onboarding@resend.dev`).
- Recipient: `contact@magdysaber.com`. Reply-to is set to the visitor's email.
- Without `RESEND_API_KEY`, endpoint returns 503 with a friendly message asking the visitor to email directly.

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/portfolio run dev` — run portfolio locally

## Path Aliases (portfolio)

- `@/` → `src/`
- `@stores` → `src/stores`
- `@constants` → `src/constants`
- `@types` → `src/types`

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
