import type { FunctionalUIInput } from "@functional-ui-poc/shared-contract";
import { isAbortError, toMessage } from "./workflow-state.js";
import { canSubmit, newSignal, type WorkflowStore } from "./workflow-store.js";

/** Kick off the initial load exactly once, when still idle. */
export function start(store: WorkflowStore): void {
  if (store.state.status === "idle") void load(store);
}

export async function load(store: WorkflowStore): Promise<void> {
  const signal = newSignal(store);
  store.state = { status: "loading", entities: [], selectedEntityId: null, result: null, errorMessage: null };
  store.onChange();
  try {
    const entities = await store.api.getEntities({ actionId: store.input.actionId, signal });
    store.state = { ...store.state, status: "ready", entities };
  } catch (error) {
    if (isAbortError(error)) return;
    store.failedStep = "load";
    store.state = { ...store.state, status: "error", errorMessage: toMessage(error) };
  }
  store.onChange();
}

export function select(store: WorkflowStore, entityId: string): void {
  if (store.state.status !== "ready") return;
  store.state = { ...store.state, selectedEntityId: entityId };
  store.onChange();
}

export async function submit(store: WorkflowStore): Promise<void> {
  if (!canSubmit(store) || store.state.selectedEntityId === null) return;
  const selectedEntityId = store.state.selectedEntityId;
  const signal = newSignal(store);
  store.state = { ...store.state, status: "submitting", errorMessage: null };
  store.onChange();
  try {
    const result = await store.api.executeAction({ actionId: store.input.actionId, selectedEntityId, signal });
    store.state = { ...store.state, status: "success", result };
    store.onChange();
    store.onSuccess(result);
    return;
  } catch (error) {
    if (isAbortError(error)) return;
    store.failedStep = "submit";
    store.state = { ...store.state, status: "error", errorMessage: toMessage(error) };
  }
  store.onChange();
}

export function retry(store: WorkflowStore): void {
  if (store.failedStep === "submit") void submit(store);
  else void load(store);
}

export function reset(store: WorkflowStore): void {
  store.failedStep = null;
  void load(store);
}

export function update(store: WorkflowStore, input: FunctionalUIInput): void {
  store.input = input;
  reset(store);
}
