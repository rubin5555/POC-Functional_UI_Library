export {
  mountFunctionalAction,
  type MountFunctionalActionOptions,
  type MithrilFunctionalUIInstance,
} from "./mount/mount-functional-action.js";

// Re-export the shared contract types so consumers can import them from here.
export type {
  FunctionalUIInput,
  FunctionalUIResult,
  FunctionalUIApi,
} from "@functional-ui-poc/shared-contract";
