import type { FunctionalWorkflowController } from "./workflow-controller.js";

const isAbort = (error: unknown) =>
  error instanceof DOMException && error.name === "AbortError";
const message = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong.";

/** Kick off the initial load exactly once, when still idle. */
export async function start(
  controller: FunctionalWorkflowController
): Promise<void> {
  if (controller.status === "idle") await load(controller);
}

export async function load(
  controller: FunctionalWorkflowController
): Promise<void> {
  if (!controller.api || !controller.input) return;
  const signal = controller.newSignal();
  controller.patch({ status: "loading", entities: [], selectedEntityId: null, result: null, errorMessage: null });
  try {
    const entities = await controller.api.getEntities({
      actionId: controller.input.actionId,
      signal,
    });
    controller.patch({ status: "ready", entities });
  } catch (error) {
    if (isAbort(error)) return;
    controller.failedStep = "load";
    controller.patch({ status: "error", errorMessage: message(error) });
  }
}

export function select(
  controller: FunctionalWorkflowController,
  entityId: string
): void {
  if (controller.status === "ready") {
    controller.patch({ selectedEntityId: entityId });
  }
}

export async function submit(
  controller: FunctionalWorkflowController
): Promise<void> {
  if (!controller.canSubmit || !controller.api || !controller.input) return;
  const selectedEntityId = controller.selectedEntityId;
  if (selectedEntityId === null) return;

  const signal = controller.newSignal();
  controller.patch({ status: "submitting", errorMessage: null });
  try {
    const result = await controller.api.executeAction({
      actionId: controller.input.actionId,
      selectedEntityId,
      signal,
    });
    controller.patch({ status: "success", result });
    controller.onSuccess(result);
  } catch (error) {
    if (isAbort(error)) return;
    controller.failedStep = "submit";
    controller.patch({ status: "error", errorMessage: message(error) });
  }
}

/** Re-run whichever step failed. */
export function retry(controller: FunctionalWorkflowController): void {
  if (controller.failedStep === "submit") void submit(controller);
  else void load(controller);
}

/** Return to a fresh run of the workflow. */
export function reset(controller: FunctionalWorkflowController): void {
  controller.failedStep = null;
  controller.patch({ status: "idle", entities: [], selectedEntityId: null, result: null, errorMessage: null });
  void load(controller);
}
