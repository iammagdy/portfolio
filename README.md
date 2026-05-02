# Magdy Saber — 3D Portfolio

A fully interactive 3D portfolio built with React, Three.js, and GSAP. Scroll through a living scene, switch between day and night, and step through portal tiles into the Experience section.

> Inspired by the work of Mohit.

---

## Tech Stack

| Layer | Library |
|---|---|
| 3D rendering | [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) + [Three.js](https://threejs.org) |
| 3D helpers | [@react-three/drei](https://github.com/pmndrs/drei) |
| Animation | [GSAP](https://gsap.com) |
| State | [Zustand](https://zustand-demo.pmnd.rs) |
| Styling | [Tailwind CSS](https://tailwindcss.com) |
| Build | [Vite](https://vitejs.dev) |
| Mobile | [Expo](https://expo.dev) (React Native) |
| Monorepo | [pnpm workspaces](https://pnpm.io/workspaces) |

---

## Features

- **Day / Night theme** — toggle between a blue-sky day scene and a starfield night scene
- **Scroll-driven camera** — GSAP + R3F animate the camera through each section as you scroll
- **Portal tiles** — MeshPortalMaterial tiles in the Experience section open into dedicated 3D worlds for Side Projects and Work & Education
- **Work & Education timeline** — chronological 3D camera flight through 11 roles (2008 → 2026) followed by an Education segment (BA Journalism · Data Science · Software Engineering · HR)
- **Responsive** — mobile-optimised DOM overlays for the Work & Projects sections (no 3D camera flight on small screens)
- **Companion mobile app** — native iOS / Android version of the portfolio built with Expo
- **Animated promo video** — short kinetic-typography intro built in code with Framer Motion

---

## Workspace Layout

This is a pnpm monorepo. Each runnable surface lives under `artifacts/`:

| Path | Description |
|---|---|
| `artifacts/portfolio` | Main 3D web portfolio (Vite + React Three Fiber) |
| `artifacts/portfolio-mobile` | Companion Expo mobile app |
| `artifacts/portfolio-promo-video` | Animated promo video built in React |
| `artifacts/api-server` | Shared Express API server |
| `artifacts/mockup-sandbox` | Internal canvas mockup sandbox (development only) |
| `lib/` | Shared libraries (db schema, api-spec, etc.) |

---

## Getting Started

Install dependencies once at the workspace root:

```bash
pnpm install
```

Then run any artifact you want:

```bash
# Main 3D portfolio (web)
pnpm --filter @workspace/portfolio run dev

# Mobile companion (Expo)
pnpm --filter @workspace/portfolio-mobile run dev

# Promo video
pnpm --filter @workspace/portfolio-promo-video run dev
```

Build the web portfolio for production:

```bash
pnpm --filter @workspace/portfolio run build
```

---

## License

MIT
