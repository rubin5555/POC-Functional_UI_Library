// Public React entrypoint for the Stencil package.
//
// The wrapper under ./generated is produced by @stencil/react-output-target and
// must not be hand-edited. This barrel is the hand-written public surface: it
// gives the generated default export the documented name and re-exports the
// shared types, keeping generated code separate from the public API.
export { default as StencilFunctionalAction } from "./generated/FunctionalActionStencil";

export type {
  FunctionalUIInput,
  FunctionalUIResult,
  FunctionalUIApi,
} from "@functional-ui-poc/shared-contract";
