# 04 — Mithril slice: full `/mithril` route

**What to build:** The complete Mithril path through every layer, ending in a fully usable `/mithril` route. The library is implemented in Mithril but never forces the host to become a Mithril application: it exposes a framework-neutral `mountFunctionalAction()` that mounts into a caller-provided DOM node and returns a `destroy()` handle. A user visiting `/mithril` can run the sample workflow twice: once via a React-owned container calling the mount API manually, and once through a thin React bridge — both driving the same shared mock API through the full state machine.

**Blocked by:** 01, 02.

**Status:** done

- [x] `@functional-ui-poc/mithril` package builds independently to real `dist` output with generated declarations, and configures real package exports (root, `/react`).
- [x] `mountFunctionalAction({ target, input, api, onSuccess })` mounts into a caller-provided node, keeps state isolated per instance via a closure-based `createWorkflowStore` (no module-level mutable state), and returns an instance exposing `destroy()` and `update(input)`.
- [x] `destroy()` cleans up completely (`m.mount(target, null)` + abort); multiple instances coexist without interfering (verified in unit test + live: two mounts selected different entities independently).
- [x] The host interacts only through callbacks — it never needs to understand Mithril; the success result is delivered via `onSuccess`.
- [x] A thin React bridge creates a `div` ref, mounts after mount, destroys on unmount, updates in place via `instance.update(input)` on input changes and remounts on api changes — behavior documented in the bridge's JSDoc.
- [x] The `/mithril` route renders both sections — the manual programmatic-mount section and the React-bridge section — each with the debug area and reset, importing only public package exports.
- [x] Tests prove: loading starts, entities appear, an entity can be selected + enables submit, submit triggers the API, success is called back with the result, error is displayed, destroy leaves nothing active, and multiple instances stay isolated. 7/7 unit tests pass; both sections verified live in the browser.

**Note (styling):** Mithril has no Shadow DOM, so styles are applied inline per vnode to avoid leaking/inheriting global CSS — the deliberate trade-off vs. the Shadow-DOM packages, captured for the comparison write-up.
