export {
  FunctionalActionLit,
  FUNCTIONAL_ACTION_LIT_TAG,
} from "./components/functional-action-lit.js";
export {
  FUNCTIONAL_UI_SUCCESS_EVENT,
  type FunctionalUISuccessEvent,
} from "./events.js";
export { registerFunctionalActionLit } from "./register-element.js";

// Re-export the shared contract types so consumers can import them from the
// package they already depend on.
export type {
  FunctionalUIInput,
  FunctionalUIResult,
  FunctionalUIApi,
} from "@functional-ui-poc/shared-contract";
