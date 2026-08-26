import type {
  FunctionalUIApi,
  FunctionalUIInput,
  FunctionalUIResult,
} from "@functional-ui-poc/shared-contract";
import { initialState, type WorkflowState } from "./workflow-state.js";

/**
 * An isolated store for one mounted instance. State plus its config and request
 * handle live here as a plain object; the transitions live in
 * `workflow-actions.ts`. No module-level mutable state, so multiple mounts stay
 * fully independent.
 */
export type WorkflowStore = {
  state: WorkflowState;
  input: FunctionalUIInput;
  api: FunctionalUIApi;
  onChange: () => void;
  onSuccess: (result: FunctionalUIResult) => void;
  inflight: AbortController | null;
  failedStep: "load" | "submit" | null;
};

export type WorkflowStoreConfig = {
  input: FunctionalUIInput;
  api: FunctionalUIApi;
  onChange: () => void;
  onSuccess: (result: FunctionalUIResult) => void;
};

export function createWorkflowStore(config: WorkflowStoreConfig): WorkflowStore {
  return { ...config, state: initialState(), inflight: null, failedStep: null };
}

export const canSubmit = (store: WorkflowStore): boolean =>
  store.state.status === "ready" && store.state.selectedEntityId !== null;

/** Abort any in-flight request and start a fresh one. */
export function newSignal(store: WorkflowStore): AbortSignal {
  destroyStore(store);
  store.inflight = new AbortController();
  return store.inflight.signal;
}

export function destroyStore(store: WorkflowStore): void {
  store.inflight?.abort();
  store.inflight = null;
}
