import { NavLink, Outlet } from "react-router-dom";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/lit", label: "Lit" },
  { to: "/mithril", label: "Mithril" },
  { to: "/stencil", label: "Stencil" },
] as const;

export function Layout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-brand">Functional UI POC</div>
        <nav className="app-nav">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                isActive ? "nav-link nav-link--active" : "nav-link"
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
