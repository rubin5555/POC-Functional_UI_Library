import type { ReactNode } from "react";

type WorkflowSectionProps = {
  /** The integration mode this section demonstrates (e.g. "Native custom element"). */
  mode: string;
  /** Optional one-line explanation of what this section verifies. */
  note?: string;
  children: ReactNode;
};

/**
 * One integration mode within a technology route. Each technology route renders
 * two of these — a framework-neutral/native section and a React-integration
 * section — so both consumption paths are visible side by side.
 */
export function WorkflowSection({ mode, note, children }: WorkflowSectionProps) {
  return (
    <section className="workflow-section">
      <header className="workflow-section__head">
        <span className="badge">Integration mode</span>
        <h3 className="workflow-section__mode">{mode}</h3>
      </header>
      {note && <p className="workflow-section__note">{note}</p>}
      <div className="workflow-section__body">{children}</div>
    </section>
  );
}
