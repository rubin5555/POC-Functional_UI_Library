import { createContext, useContext, useMemo, type ReactNode } from "react";
import {
  createMockApi,
  type FunctionalUIApi,
} from "@functional-ui-poc/shared-contract";

const ApiContext = createContext<FunctionalUIApi | null>(null);

/**
 * Constructs the shared mock API exactly once and makes it available to every
 * route. A real external consumer would build its own API client here (with a
 * base URL and credentialed session) and pass it down the same way — nothing in
 * the routes reaches into package internals to get data.
 */
export function ApiProvider({ children }: { children: ReactNode }) {
  const api = useMemo(() => createMockApi(), []);
  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
}

/** Access the shared API instance from within a route. */
export function useApi(): FunctionalUIApi {
  const api = useContext(ApiContext);
  if (!api) {
    throw new Error("useApi must be used within <ApiProvider>");
  }
  return api;
}
