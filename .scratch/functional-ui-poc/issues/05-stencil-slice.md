# 05 — Stencil slice: full `/stencil` route

**What to build:** The complete Stencil path through every layer, ending in a fully usable `/stencil` route. The workflow is built as a Stencil web component with typed props and typed events, exposing an equivalent public surface to the Lit implementation. A user visiting `/stencil` can run the sample workflow twice: once via the Stencil-generated custom element, and once through Stencil's recommended React integration — both driving the same shared mock API through the full state machine. Generated wrapper/loader code is kept separate from hand-written public exports.

**Blocked by:** 01, 02.

**Status:** done

- [x] `@functional-ui-poc/stencil` package builds independently (`stencil build` → dist/custom-elements + lazy loader + types, then `tsc` compiles the generated React wrapper), and configures real package exports (root, `/loader`, `/react`, plus a `./dist/components/*` subpath the generated wrapper needs) with generated declarations.
- [x] A `functional-action-stencil` component implements the full workflow with typed `@Prop` (`input`, `api`) and a typed `@Event() functionalUiSuccess`, uses Shadow DOM, drives async workflow state via `@State`, and cleans up pending work on `disconnectedCallback` (aborts in-flight requests).
- [x] Stencil's recommended React integration (`@stencil/react-output-target` 0.7, built on `@lit/react`) generates the wrapper into `src/react-lib/generated` (git-ignored, never hand-edited); a hand-written barrel names it `StencilFunctionalAction` and is compiled to `dist/react`. Loader + wrapper setup documented in code comments.
- [x] The `/stencil` route renders both sections — native (registered via the generated `/loader`) and the React integration (`StencilFunctionalAction`) — each with the debug area and reset, importing only public package exports.
- [x] Business behavior is equivalent to Lit and Mithril (same six states, same result shape).
- [x] Tests prove: loading starts, entities appear, select enables submit, submit triggers the API, typed success event is emitted, error is displayed, retry recovers, and disconnect leaves nothing active. 7/7 Stencil spec tests pass (`newSpecPage`); both sections verified live in **dev and production preview** (lazy loader works in prod).

**Notes for the comparison write-up:**
- Stencil colocates state/logic/render on the component (`@State`) rather than splitting into a controller like the Lit package.
- The React wrapper is *generated source* that must be compiled (extra build step vs. the hand-written Lit/Mithril wrappers), and its event prop is `onFunctionalUiSuccess(event)` — the route unwraps `event.detail` rather than the ideal `onSuccess(result)`.
- Stencil's integrated Jest test runner is deprecated (v5 will remove it) and didn't resolve the ESM workspace mock cleanly, so the spec uses a local mock.
