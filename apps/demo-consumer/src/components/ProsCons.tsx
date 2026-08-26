import type { TechNotes } from "./tech-notes";

/** Renders the pros/cons/summary for a technology at the top of its route. */
export function ProsCons({ pros, cons, note }: TechNotes) {
  return (
    <section className="proscons">
      <div className="proscons__cols">
        <div className="proscons__col proscons__col--pro">
          <h4 className="proscons__title">Pros</h4>
          <ul>
            {pros.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="proscons__col proscons__col--con">
          <h4 className="proscons__title">Cons</h4>
          <ul>
            {cons.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <p className="proscons__note">{note}</p>
    </section>
  );
}
