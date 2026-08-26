# 02 — Demo consumer shell + routing

**What to build:** The React + TypeScript + Vite consumer application that represents an external product embedding the future library. A developer can run `pnpm dev`, land on the home page, and navigate to each technology route. The home page links to `/lit`, `/mithril`, and `/stencil`; each of those is a placeholder for now. The app constructs the shared mock API once and is structured to pass it down to each route, so the technology slices only have to drop their implementation into an already-working shell.

**Blocked by:** 01 (consumes the shared mock API and contract types).

**Status:** done

- [x] One React + TypeScript + Vite app exists under the workspace and starts via `pnpm dev` (root `dev` filters to `demo-consumer`; concurrent package watch is added as the tech packages arrive in 03–05).
- [x] React Router is wired with routes `/`, `/lit`, `/mithril`, `/stencil`.
- [x] The `/` home page links to each technology route.
- [x] The three technology routes render placeholders and share a common layout (`TechPage` + `WorkflowSection` + `DebugPanel`) that already provides technology name, current integration mode, a debug area, and a reset control.
- [x] The app instantiates the shared mock API from `@functional-ui-poc/shared-contract` public exports via `ApiProvider`/`useApi` and makes it available to each route ("API wired: yes" confirmed at runtime).
- [x] Navigating between all four routes works (deep links included, SPA fallback) with no console or dev-server errors.
