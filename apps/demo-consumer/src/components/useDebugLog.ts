import { useCallback, useState } from "react";

export type DebugEntry = {
  id: number;
  time: string;
  message: string;
};

/**
 * A tiny append-only event log used by each route's debug area. Technology
 * slices call `log()` whenever the underlying implementation emits an event
 * (state change, success result, error) so the route can show what happened.
 */
export function useDebugLog() {
  const [entries, setEntries] = useState<DebugEntry[]>([]);

  const log = useCallback((message: string) => {
    setEntries((prev) => [
      ...prev,
      {
        id: prev.length,
        time: new Date().toLocaleTimeString(),
        message,
      },
    ]);
  }, []);

  const clear = useCallback(() => setEntries([]), []);

  return { entries, log, clear };
}
