# Functional UI Library POC — Lit vs Mithril vs Stencil

A proof-of-concept that implements the **same functional UI workflow three times** —
in [Lit](https://lit.dev), [Mithril](https://mithril.js.org), and
[Stencil](https://stenciljs.com) — to decide which gives the best foundation for
a future framework-agnostic **functional UI library** that external systems embed
in their own apps.

The workflow (identical in all three): receive an `actionId`, call an API to fetch
entities, let the user pick one, confirm, execute an action, and emit the result
back to the host. Same six-state machine (`idle → loading → ready → submitting →
success → error`), same shared API contract, same behavior — only the technology
differs.

## Layout

```text
apps/demo-consumer          React + Vite consumer app (the "external product")
packages/shared-contract    Shared types + mock API + state-machine spec
packages/lit-functional-ui       @functional-ui-poc/lit
packages/mithril-functional-ui   @functional-ui-poc/mithril
packages/stencil-functional-ui   @functional-ui-poc/stencil
scripts/compare.mjs         Generates comparison-results.md
```

The consumer imports each package only through its **public exports** — never
source files — exactly as an external installer would.

## Getting started

```bash
pnpm install
pnpm dev
```

`pnpm dev` builds the packages once, then runs each package's `tsc --watch` and the
Vite dev server in parallel. Open http://localhost:5173 and pick a route.

## Routes

| Route       | Implementation | Sections shown                                   |
| ----------- | -------------- | ------------------------------------------------ |
| `/`         | Home           | Links to each technology + the live comparison table (from `pnpm compare`) |
| `/lit`      | Lit            | Native custom element · React wrapper            |
| `/mithril`  | Mithril        | Programmatic mount · React bridge                |
| `/stencil`  | Stencil        | Native (generated loader) · generated React wrapper |

## Commands

```bash
pnpm install   # install the workspace
pnpm dev       # start the demo consumer (packages in watch mode)
pnpm build     # build every package and the consumer
pnpm test      # run each package's tests (Vitest for Lit/Mithril/contract, Stencil spec runner)
pnpm compare   # build all three packages, (re)generate comparison-results.md,
               # and refresh the numbers shown on the Home route

```

## Public API (identical shape across packages)

Each package re-exports the shared contract types and its own integration:

```ts
// Lit — native custom element + thin React wrapper
import "@functional-ui-poc/lit/register";       // defines <functional-action-lit>
import { LitFunctionalAction } from "@functional-ui-poc/lit/react";

// Mithril — framework-neutral mount + thin React bridge
import { mountFunctionalAction } from "@functional-ui-poc/mithril";
import { MithrilFunctionalAction } from "@functional-ui-poc/mithril/react";

// Stencil — generated loader + generated React wrapper
import { defineCustomElements } from "@functional-ui-poc/stencil/loader";
import { StencilFunctionalAction } from "@functional-ui-poc/stencil/react";
```

## Dependency behavior

One explicit goal of the POC is understanding **what the consumer actually
downloads**.

- **React** is a `peerDependency` on every package's `/react` (and `/loader`)
  entry — never bundled. The consumer supplies the single React copy.
- **Lit** is a normal runtime `dependency` of `@functional-ui-poc/lit`. The `tsc`
  build leaves `import 'lit'` in place, so the consumer's bundler pulls Lit in
  once (shared across every Lit component).
- **Mithril** is a normal runtime `dependency` of `@functional-ui-poc/mithril`.
  The host never has to know Mithril is there — it only calls `mountFunctionalAction`
  and receives callbacks.
- **Stencil** components depend on `@stencil/core`'s small runtime, plus
  `@stencil/react-output-target` (whose generated wrapper drags in a `@lit/react`
  based runtime) for the React entry. So the React path costs more transitive
  runtime than the hand-written Lit/Mithril wrappers.

See [comparison-results.md](comparison-results.md) for measured bundle sizes,
dependency counts, build durations, and the qualitative comparison + final
recommendation.

## Auth-readiness (not implemented, but designed for)

Per the brief, the API boundary is shaped so browser-session auth can be added
later without touching UI code: `userId` is context only (never a security
boundary), all data access is centralized in the API client, and the config type
leaves room for a `baseUrl` + `credentials: "include"`. The POC ships a
deterministic mock API only.
