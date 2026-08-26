export type TechNotes = {
  pros: string[];
  cons: string[];
  note: string;
};

export const TECH_NOTES: Record<"lit" | "mithril" | "stencil", TechNotes> = {
  lit: {
    pros: [
      "Real custom element — the framework-agnostic boundary an SDK wants.",
      "Plain tsc build (~6 s); no bespoke compiler or generated code to reconcile.",
      "Reactive controller cleanly separates state/API from rendering.",
      "Shadow DOM style isolation for free.",
      "Thin hand-written React wrapper hits the exact onSuccess(result) API.",
      "One runtime dependency (lit); leanest footprint.",
    ],
    cons: [
      "Decorators need experimentalDecorators + useDefineForClassFields:false in tsconfig.",
      "React bridge is hand-wired (property assignment + event listener).",
    ],
    note: "Recommended for this POC — best balance of a real web-component boundary and simple tooling.",
  },
  mithril: {
    pros: [
      "Framework-neutral mount()/destroy() handle; the host never becomes a Mithril app.",
      "Simplest imperative mental model; isolated per-instance state.",
      "Plain tsc build with the fewest generated files.",
    ],
    cons: [
      "Not a web component — a weaker distribution boundary (no declarative HTML usage).",
      "No Shadow DOM → styles are inlined per vnode to avoid leaking/inheriting host CSS.",
      "Global m.redraw() redraws every mounted root; boolean attributes render as \"\".",
      "Largest runtime bundle of the three.",
    ],
    note: "A great embedding tool, but weaker as a distributable web component.",
  },
  stencil: {
    pros: [
      "Smallest gzipped runtime; a real compiled custom element with typed @Prop/@Event.",
      "@State-driven components are ergonomic to write; Shadow DOM isolation like Lit.",
      "The React wrapper is generated — no bridge to hand-maintain as the component evolves.",
    ],
    cons: [
      "Heaviest toolchain: own compiler, much slower build, the most generated files.",
      "Generated React wrapper is source you must compile; extra @stencil/react-output-target + @lit/react runtime.",
      "Event prop is onFunctionalUiSuccess(event), not the ideal onSuccess(result).",
      "Integrated Jest test runner is deprecated (removed in Stencil v5).",
    ],
    note: "Best if the library grows to many components and wants generated wrappers across many frameworks at scale.",
  },
};
