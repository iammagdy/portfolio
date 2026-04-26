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
- **API framework**: Express 5 (artifacts/api-server, currently only serves /api/healthz)
- **Database**: PostgreSQL + Drizzle ORM (not used by portfolio)

## Artifacts

- `artifacts/portfolio` — Main 3D portfolio web app (preview path: `/`, port 21113)
- `artifacts/api-server` — Express backend (preview path: `/api`, port 8080)

## Routing

The Replit preview proxy routes by artifact `paths`:
- `/api/*` → api-server (artifacts/api-server/.replit-artifact/artifact.toml `paths = ["/api"]`)
- `/*` → portfolio (artifacts/portfolio/.replit-artifact/artifact.toml `paths = ["/"]`)

This means the portfolio's frontend can call `fetch("/api/...")` directly — no env-driven base URL or Vite proxy is needed in dev or prod. Both artifacts have their own workflows that run independently.

## Contact Button

- Component: `artifacts/portfolio/src/components/common/ContactButton.tsx`
- Right-edge pill labeled "Contact me" with the same GSAP slide-in / scroll-out animation as the previous Awwards badge.
- Clicking opens a `mailto:contact@magdysaber.com` link (with a pre-filled subject and body) in the visitor's email app — no backend or third-party email service required.

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/portfolio run dev` — run portfolio locally

## Path Aliases (portfolio)

- `@/` → `src/`
- `@stores` → `src/stores`
- `@constants` → `src/constants`
- `@types` → `src/types`

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
