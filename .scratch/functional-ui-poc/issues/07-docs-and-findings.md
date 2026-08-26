# 07 — Docs & findings

**What to build:** The narrative deliverable that lets a reader act on the POC. A developer can read the root README to understand and run everything, and read `comparison-results.md` to see both the measured metrics and the human judgment: qualitative pros/cons per technology and a clear recommendation of which solution is strongest for the eventual production functional UI library, with reasoning. This closes the POC by answering its central question.

**Blocked by:** 06 (the recommendation and qualitative sections build on the generated comparison metrics).

**Status:** done

- [x] A short root README covers: purpose of the POC, technologies compared, install command, run command, the route table, build command, test command, and compare command.
- [x] `comparison-results.md` includes a manually maintained qualitative section with `#### Good / #### Bad / #### Surprising` for each of Lit, Mithril, and Stencil (first-hand from building all three).
- [x] The qualitative comparison includes a cross-cutting table addressing every spec dimension (implementation/integration/package complexity, API + custom-element ergonomics, TypeScript quality, event handling, styling isolation, debugging, bundle cost, consumer setup, ability to hide the implementation technology, and SDK suitability).
- [x] Runtime dependency behavior is documented per package in the README (React peer everywhere; Lit/Mithril left as runtime deps and bundled once by the consumer; Stencil's `@stencil/core` + generated-wrapper runtime).
- [x] The report ends with a recommendation — **Lit** — with reasoning, plus when Stencil (runner-up) or Mithril would be the better call.
- [x] `pnpm install` then `pnpm dev` builds the packages and serves the consumer; `/lit`, `/mithril`, and `/stencil` each run the identical workflow to `success` — verified live in one fresh session with no app console errors.
