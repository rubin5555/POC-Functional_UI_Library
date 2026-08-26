# 03 — Lit slice: full `/lit` route

**What to build:** The complete Lit path through every layer, ending in a fully usable `/lit` route. A user visiting `/lit` can run the sample workflow twice: once against the raw Lit custom element rendered directly, and once through the thin React wrapper — both driving the same shared mock API and showing loading, empty, error, selection, submit, success, and reset behavior. The consumer imports the Lit package exactly as an external installer would (public entrypoints only, never source files).

**Blocked by:** 01, 02.

**Status:** done

- [x] `@functional-ui-poc/lit` package builds independently to real `dist` output with generated declarations, and configures real package exports (root, `/react`, `/register`).
- [x] A `functional-action-lit` custom element implements the full workflow using reactive Lit properties/state, accepts `input` and `api` as properties (not serialized attributes), uses Shadow DOM, keeps API/state separate from rendering (state/API live in a `FunctionalWorkflowController` reactive controller), and supports safe repeated registration via a guarded `/register` entrypoint.
- [x] The element emits a `functional-ui-success` `CustomEvent` (`bubbles`, `composed`) carrying the result, and aborts in-flight work on disconnect (`hostDisconnected` → controller cleanup).
- [x] A thin React wrapper (`/react`) assigns object properties to the element, bridges the CustomEvent to a typed `onSuccess(result)` callback, forwards `className`, handles mount/unmount, and does not re-implement the workflow.
- [x] The `/lit` route renders both sections — the native custom element created directly from React, and the React wrapper — each with the debug area and reset, importing only public package exports (`/register`, root, `/react`).
- [x] Tests prove: loading starts, entities appear, an entity can be selected, submit stays disabled until selection + triggers the API, success is emitted, error is displayed, and teardown aborts and emits nothing. 7/7 unit tests pass, and the full flow (select → submit → success → event bridged → reset) was verified live in the browser for both integration modes.
