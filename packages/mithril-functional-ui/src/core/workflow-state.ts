import type {
  Entity,
  FunctionalUIResult,
  FunctionalUIState,
} from "@functional-ui-poc/shared-contract";

/** The per-instance workflow state (see `STATE-MACHINE.md` in shared-contract). */
export type WorkflowState = {
  status: FunctionalUIState;
  entities: Entity[];
  selectedEntityId: string | null;
  result: FunctionalUIResult | null;
  errorMessage: string | null;
};

export function initialState(): WorkflowState {
  return {
    status: "idle",
    entities: [],
    selectedEntityId: null,
    result: null,
    errorMessage: null,
  };
}

export const isAbortError = (error: unknown): boolean =>
  error instanceof DOMException && error.name === "AbortError";

export const toMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "Something went wrong.";
