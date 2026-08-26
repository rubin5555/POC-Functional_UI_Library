export { FunctionalActionStencil } from "./components/functional-action-stencil/functional-action-stencil";

// Re-export the Stencil-generated event type so the generated React wrapper can
// import it from the package root.
export type { FunctionalActionStencilCustomEvent } from "./components";

// Re-export the shared contract types so consumers can import them from here.
export type {
  FunctionalUIInput,
  FunctionalUIResult,
  FunctionalUIApi,
} from "@functional-ui-poc/shared-contract";
