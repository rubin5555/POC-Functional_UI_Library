import type { FunctionalActionStencil } from "./functional-action-stencil";

type ComponentHost = FunctionalActionStencil;

const isAbort = (error: unknown) =>
  error instanceof Error && error.name === "AbortError";
const message = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong.";

/**
 * Workflow transitions for the Stencil component, as free functions that read
 * and write the component's `@State`/`@Prop` fields. Assigning to a `@State`
 * field on the instance triggers Stencil's re-render, so keeping these out of
 * the class keeps the component itself a small, declarative shell.
 */
export function maybeStart(host: ComponentHost): void {
  if (host.input && host.api && host.status === "idle") void load(host);
}

export function canSubmit(host: ComponentHost): boolean {
  return host.status === "ready" && host.selectedEntityId !== null;
}

function newSignal(host: ComponentHost): AbortSignal {
  host.inflight?.abort();
  host.inflight = new AbortController();
  return host.inflight.signal;
}

export async function load(host: ComponentHost): Promise<void> {
  if (!host.api || !host.input) return;
  const signal = newSignal(host);
  host.status = "loading";
  host.entities = [];
  host.selectedEntityId = null;
  host.result = null;
  host.errorMessage = null;
  try {
    host.entities = await host.api.getEntities({ actionId: host.input.actionId, signal });
    host.status = "ready";
  } catch (error) {
    if (isAbort(error)) return;
    host.failedStep = "load";
    host.errorMessage = message(error);
    host.status = "error";
  }
}

export function select(host: ComponentHost, entityId: string): void {
  if (host.status === "ready") host.selectedEntityId = entityId;
}

export async function submit(host: ComponentHost): Promise<void> {
  if (!canSubmit(host) || !host.api || !host.input || host.selectedEntityId === null) return;
  const selectedEntityId = host.selectedEntityId;
  const signal = newSignal(host);
  host.status = "submitting";
  host.errorMessage = null;
  try {
    const result = await host.api.executeAction({ actionId: host.input.actionId, selectedEntityId, signal });
    host.result = result;
    host.status = "success";
    host.functionalUiSuccess.emit(result);
  } catch (error) {
    if (isAbort(error)) return;
    host.failedStep = "submit";
    host.errorMessage = message(error);
    host.status = "error";
  }
}

export function retry(host: ComponentHost): void {
  if (host.failedStep === "submit") void submit(host);
  else void load(host);
}

export function reset(host: ComponentHost): void {
  host.failedStep = null;
  host.status = "idle";
  void load(host);
}
