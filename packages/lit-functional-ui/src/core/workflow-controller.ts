import type { ReactiveController, ReactiveControllerHost } from "lit";
import type {
  Entity,
  FunctionalUIApi,
  FunctionalUIInput,
  FunctionalUIResult,
  FunctionalUIState,
} from "@functional-ui-poc/shared-contract";

/** The mutable fields an action may patch. */
type StateFields = Pick<
  FunctionalWorkflowController,
  "status" | "entities" | "selectedEntityId" | "result" | "errorMessage"
>;

/**
 * State container for the workflow, as a Lit reactive controller. It holds the
 * data and the request lifecycle; the actual transitions live in
 * `workflow-actions.ts`, so this file stays a small, readable state surface.
 */
export class FunctionalWorkflowController implements ReactiveController {
  api: FunctionalUIApi | null = null;
  input: FunctionalUIInput | null = null;
  inflight: AbortController | null = null;
  failedStep: "load" | "submit" | null = null;

  status: FunctionalUIState = "idle";
  entities: Entity[] = [];
  selectedEntityId: string | null = null;
  result: FunctionalUIResult | null = null;
  errorMessage: string | null = null;

  constructor(
    private readonly host: ReactiveControllerHost,
    readonly onSuccess: (result: FunctionalUIResult) => void
  ) {
    host.addController(this);
  }

  hostDisconnected(): void {
    this.cleanup();
  }

  configure(input: FunctionalUIInput, api: FunctionalUIApi): void {
    this.input = input;
    this.api = api;
  }

  get canSubmit(): boolean {
    return this.status === "ready" && this.selectedEntityId !== null;
  }

  /** Apply a state change and schedule a re-render. */
  patch(next: Partial<StateFields>): void {
    Object.assign(this, next);
    this.host.requestUpdate();
  }

  /** Abort any in-flight request and start a fresh one. */
  newSignal(): AbortSignal {
    this.cleanup();
    this.inflight = new AbortController();
    return this.inflight.signal;
  }

  cleanup(): void {
    this.inflight?.abort();
    this.inflight = null;
  }
}
