# 06 — Comparison tooling: `pnpm compare`

**What to build:** The objective measurement layer that gives the POC its point. A developer can run `pnpm compare` at the root; it builds all three technology packages and generates a `comparison-results.md` report capturing the default build output for each. This makes the "what does the consumer actually download" question answerable with numbers rather than opinion.

**Blocked by:** 03, 04, 05 (all three packages must build for the comparison to run).

**Status:** done

- [x] A root `pnpm compare` command (`scripts/compare.mjs`) builds all three packages and produces `comparison-results.md`.
- [x] The report records, per technology: raw JS bundle size, gzipped JS size, CSS size, runtime dependency count + list, generated file count, build duration, type-declaration availability, web-component support, and React wrapper strategy.
- [x] Metrics reflect the default build output — each package's built entry is bundled/minified with esbuild (react external) and measured raw + gzip; a note documents the method and the Stencil lazy-entry caveat.
- [x] Running `pnpm compare` from a clean state succeeds; a hand-maintained `<!-- MANUAL-SECTION -->` (for ticket 07's DX write-up) is preserved verbatim across regenerations (verified: sentinel survived, no marker duplication).

**First-run numbers:** Lit 22.7 kB / 8.0 kB gz · Mithril 30.6 kB / 11.5 kB gz · Stencil 18.1 kB / 7.6 kB gz. Stencil build 36 s (vs ~6–7 s) and 40 generated files — real findings for ticket 07.
