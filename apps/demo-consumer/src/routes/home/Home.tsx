import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import comparison from "../../comparison-data.json";

const TECHNOLOGIES = [
  {
    to: "/lit",
    name: "Lit",
    blurb: "Custom element built on Lit reactive properties, with a thin React wrapper.",
  },
  {
    to: "/mithril",
    name: "Mithril",
    blurb: "Framework-neutral programmatic mount that never makes the host a Mithril app.",
  },
  {
    to: "/stencil",
    name: "Stencil",
    blurb: "Compiled web component with Stencil's generated React integration.",
  },
] as const;

type Tech = (typeof comparison.technologies)[number];

const METRICS: { label: string; get: (t: Tech) => ReactNode }[] = [
  { label: "Raw JS (minified, bundled)", get: (t) => t.rawJs },
  { label: "Gzipped JS", get: (t) => t.gzipJs },
  { label: "CSS size", get: (t) => t.css },
  {
    label: "Runtime dependencies",
    get: (t) => `${t.runtimeDeps} — ${t.runtimeDepList.join(", ")}`,
  },
  { label: "Generated files", get: (t) => t.generatedFiles },
  { label: "Build duration", get: (t) => t.buildDuration },
  { label: "Type declarations", get: (t) => (t.typeDeclarations ? "Yes" : "No") },
  { label: "Web component", get: (t) => t.webComponent },
  { label: "React wrapper strategy", get: (t) => t.reactStrategy },
];

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleString();
}

export function Home() {
  const { technologies, generatedAt } = comparison;

  return (
    <section className="home">
      <h2>Functional UI Library — Technology POC</h2>
      <p className="home__lead">
        The same functional workflow — fetch entities, select one, execute an
        action, emit a result — implemented three times. Open a route to run it
        through that technology as both a native/neutral integration and a React
        integration.
      </p>
      <ul className="tech-grid">
        {TECHNOLOGIES.map((tech) => (
          <li key={tech.to} className="tech-card">
            <Link to={tech.to} className="tech-card__link">
              <h3>{tech.name}</h3>
            </Link>
            <p>{tech.blurb}</p>
          </li>
        ))}
      </ul>

      <div className="compare">
        <div className="compare__head">
          <h3>Comparison results</h3>
          <span className="compare__timestamp">
            from <code>pnpm compare</code> · {formatTimestamp(generatedAt)}
          </span>
        </div>
        <div className="compare__scroll">
          <table className="compare__table">
            <thead>
              <tr>
                <th scope="col">Metric</th>
                {technologies.map((tech) => (
                  <th scope="col" key={tech.key}>
                    {tech.key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {METRICS.map((metric) => (
                <tr key={metric.label}>
                  <th scope="row">{metric.label}</th>
                  {technologies.map((tech) => (
                    <td key={tech.key}>{metric.get(tech)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="compare__note">
          Bundle sizes are each package's representative built entry, bundled and
          minified with esbuild (<code>react</code>/<code>react-dom</code>{" "}
          external), measured raw and gzipped. Re-run <code>pnpm compare</code> to
          refresh these numbers. See <code>comparison-results.md</code> for the
          full qualitative write-up and recommendation.
        </p>
      </div>
    </section>
  );
}
