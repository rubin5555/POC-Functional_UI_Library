import type { FunctionalUIResult } from "@functional-ui-poc/shared-contract";

/** Name of the browser CustomEvent emitted when the workflow succeeds. */
export const FUNCTIONAL_UI_SUCCESS_EVENT = "functional-ui-success";

/** The typed CustomEvent the Lit element dispatches on success. */
export type FunctionalUISuccessEvent = CustomEvent<FunctionalUIResult>;
