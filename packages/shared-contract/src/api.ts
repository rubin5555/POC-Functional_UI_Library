import type {
  Entity,
  FunctionalUIApi,
  FunctionalUIResult,
} from "./types.js";
import { getMockEntities } from "./mock-data.js";

/**
 * Options for the mock API. These let the demo consumer exercise every branch
 * of the shared behavioral contract — loading, empty results, and errors —
 * without a real backend.
 */
export type MockApiOptions = {
  /** Artificial latency (ms) applied to each call. Default: 600. */
  delayMs?: number;
  /** When true, `getEntities` returns an empty list (empty-result state). */
  emptyEntities?: boolean;
  /** When true, `getEntities` rejects (error state on load). */
  failGetEntities?: boolean;
  /** When true, `executeAction` rejects (error state on submit). */
  failExecuteAction?: boolean;
};

const DEFAULT_DELAY_MS = 600;

/** The abort reason used across the mock so callers can detect cancellation. */
function abortError(): DOMException {
  return new DOMException("The operation was aborted.", "AbortError");
}

/**
 * Promise-based delay that honors an `AbortSignal`: it rejects with an
 * `AbortError` if the signal is already aborted or aborts while pending, and
 * cleans up its timer and listener either way.
 */
function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(abortError());
      return;
    }

    const timer = setTimeout(() => {
      cleanup();
      resolve();
    }, ms);

    const onAbort = () => {
      cleanup();
      reject(abortError());
    };

    const cleanup = () => {
      clearTimeout(timer);
      signal?.removeEventListener("abort", onAbort);
    };

    signal?.addEventListener("abort", onAbort);
  });
}

/**
 * Creates a deterministic in-memory implementation of {@link FunctionalUIApi}.
 *
 * Centralizing all data access here (rather than scattering `fetch()` calls
 * through UI components) keeps the API boundary in one place. This is where a
 * real client — configured with a `baseUrl` and `credentials: "include"` for
 * browser-session auth — would slot in later without touching any UI code.
 */
export function createMockApi(options: MockApiOptions = {}): FunctionalUIApi {
  const {
    delayMs = DEFAULT_DELAY_MS,
    emptyEntities = false,
    failGetEntities = false,
    failExecuteAction = false,
  } = options;

  return {
    async getEntities({ actionId, signal }): Promise<Entity[]> {
      await delay(delayMs, signal);
      if (failGetEntities) {
        throw new Error(`Failed to load entities for action "${actionId}".`);
      }
      return emptyEntities ? [] : getMockEntities(actionId);
    },

    async executeAction({
      actionId,
      selectedEntityId,
      signal,
    }): Promise<FunctionalUIResult> {
      await delay(delayMs, signal);
      if (failExecuteAction) {
        throw new Error(`Failed to execute action "${actionId}".`);
      }
      return {
        actionId,
        selectedEntityId,
        status: "success",
      };
    },
  };
}
