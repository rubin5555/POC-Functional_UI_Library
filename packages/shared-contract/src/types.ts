/**
 * Shared domain contract for the Functional UI POC.
 *
 * These types are the single source of truth that the Lit, Mithril, and Stencil
 * implementations all consume. The implementations must NOT share controller or
 * rendering code — only these types, the mock data, and the API contract.
 */

/**
 * Public input to a functional UI workflow, provided by the host application.
 *
 * Note on auth: `userId` is context only. It is deliberately NOT a security
 * boundary — see the auth-readiness notes in `api.ts`. Never treat a
 * caller-provided identity as trusted authentication.
 */
export type FunctionalUIInput = {
  actionId: string;
  userId?: string;
  context?: {
    sourceEntityId?: string;
  };
};

/** An entity the user can pick inside the workflow. */
export type Entity = {
  id: string;
  name: string;
  type: string;
};

/** The result emitted back to the host application on a successful workflow. */
export type FunctionalUIResult = {
  actionId: string;
  selectedEntityId: string;
  status: "success";
};

/**
 * The API surface every implementation calls. A host (or the demo consumer)
 * supplies a concrete implementation — the POC ships a deterministic mock.
 *
 * UI components must receive this through explicit configuration; they must not
 * hard-code `fetch()` calls of their own.
 */
export interface FunctionalUIApi {
  getEntities(input: {
    actionId: string;
    signal?: AbortSignal;
  }): Promise<Entity[]>;

  executeAction(input: {
    actionId: string;
    selectedEntityId: string;
    signal?: AbortSignal;
  }): Promise<FunctionalUIResult>;
}

/**
 * Context describing the embedding host system. Future architecture may derive
 * this from browser origin plus a registered manifest. For the POC it is
 * context only, never trusted authentication.
 */
export type HostContext = {
  origin?: string;
  systemId?: string;
};

/**
 * Forward-looking configuration for a real (non-mock) API client. Not used by
 * the POC's mock, but present so the API boundary can grow into browser-session
 * auth without rewriting the UI: a `baseUrl` plus `credentials: "include"`.
 */
export type FunctionalUIClientConfig = {
  baseUrl: string;
  credentials?: RequestCredentials;
};

/**
 * The canonical workflow state machine. Every implementation reproduces this
 * set of states and transitions independently. See `STATE-MACHINE.md` for the
 * full transition table and required behaviors.
 */
export type FunctionalUIState =
  | "idle"
  | "loading"
  | "ready"
  | "submitting"
  | "success"
  | "error";
