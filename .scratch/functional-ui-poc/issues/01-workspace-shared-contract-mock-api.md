# 01 — Workspace foundation: shared-contract + mock API

**What to build:** Stand up the pnpm workspace monorepo and the one package every other ticket depends on. A developer can run `pnpm install` at the root and build the `shared-contract` package, which exposes the shared domain types and a working mock API that any implementation can be wired to. This ticket establishes the single source of truth for the contract and the canonical workflow state machine so the three technology implementations stay functionally equivalent without sharing controller or rendering code.

**Blocked by:** None — can start immediately.

**Status:** done

- [x] pnpm workspace is configured at the repo root (`pnpm-workspace.yaml`, root `package.json`, shared `tsconfig.base.json`) and `pnpm install` succeeds.
- [x] A `shared-contract` package exists and builds independently to real output with generated TypeScript declarations.
- [x] It exports the shared types: `FunctionalUIInput`, `Entity`, `FunctionalUIResult`, `FunctionalUIApi`, `HostContext`, and a forward-looking `FunctionalUIClientConfig`.
- [x] It provides a mock `FunctionalUIApi` implementation that returns deterministic data, introduces a small artificial delay, supports a loading window, exposes a way to simulate an error, and honors `AbortSignal` where practical.
- [x] The canonical six-state machine — `idle → loading → ready → submitting → success → error` — and the required transitions/behaviors from the contract (retry, selection, disabled-submit-until-selected, disabled-while-submitting, reset, unmount cleanup, abort) are documented in the package as the shared reference each technology implements on its own.
- [x] The API boundary is auth-ready per the spec: `userId` is not treated as a security boundary, calls are centralized, and the config type leaves room for a base URL and `credentials: "include"` later.
- [x] At least one unit test proves the mock API returns entities and executes an action.
