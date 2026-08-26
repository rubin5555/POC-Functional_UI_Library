import type { ReactNode } from "react";

type TechPageProps = {
  /** The technology name shown as the route heading. */
  name: string;
  /** One-line summary of how this technology is consumed. */
  summary: string;
  children: ReactNode;
};

/**
 * The shared frame for a technology route: the technology name, a summary, and
 * the stack of {@link WorkflowSection}s demonstrating each integration mode.
 */
export function TechPage({ name, summary, children }: TechPageProps) {
  return (
    <section className="tech-page">
      <header className="tech-page__head">
        <h2 className="tech-page__name">{name}</h2>
        <p className="tech-page__summary">{summary}</p>
      </header>
      <div className="tech-page__sections">{children}</div>
    </section>
  );
}
