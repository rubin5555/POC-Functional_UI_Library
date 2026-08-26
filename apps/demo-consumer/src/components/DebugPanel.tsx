import type { DebugEntry } from "./useDebugLog";

type DebugPanelProps = {
  /** Events emitted by the implementation, oldest first. */
  entries: DebugEntry[];
  /** Latest workflow result, if any, shown as formatted JSON. */
  result?: unknown;
  /** Resets both the implementation and this debug log. */
  onReset: () => void;
};

/**
 * The per-section debug area required by every technology route: a running list
 * of emitted events, the current result, and a reset button.
 */
export function DebugPanel({ entries, result, onReset }: DebugPanelProps) {
  return (
    <div className="debug">
      <div className="debug__header">
        <span className="debug__title">Debug — emitted events</span>
        <button type="button" className="btn btn--ghost" onClick={onReset}>
          Reset
        </button>
      </div>

      {entries.length === 0 ? (
        <p className="debug__empty">No events yet.</p>
      ) : (
        <ul className="debug__log">
          {entries.map((entry) => (
            <li key={entry.id} className="debug__entry">
              <span className="debug__time">{entry.time}</span>
              <span>{entry.message}</span>
            </li>
          ))}
        </ul>
      )}

      {result !== undefined && (
        <pre className="debug__result">{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}
