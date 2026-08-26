/**
 * Mithril has no Shadow DOM, so styles are applied inline per vnode to avoid
 * leaking/inheriting the host's global CSS. This is the deliberate Mithril
 * trade-off vs. the Shadow-DOM packages.
 */
export const styles = {
  panel: { display: "grid", gap: "0.75rem", fontFamily: "system-ui, sans-serif", color: "#1c2430" },
  status: { fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: "700", color: "#61708a" },
  list: { listStyle: "none", margin: "0", padding: "0", display: "grid", gap: "0.4rem" },
  entity: (selected: boolean, disabled: boolean) => ({
    width: "100%",
    textAlign: "left",
    padding: "0.5rem 0.7rem",
    borderRadius: "8px",
    border: `1px solid ${selected ? "#2f6feb" : "#d9dde3"}`,
    background: selected ? "#e6efff" : "#fff",
    boxShadow: selected ? "inset 0 0 0 1px #2f6feb" : "none",
    cursor: disabled ? "not-allowed" : "pointer",
    font: "inherit",
    opacity: disabled ? "0.7" : "1",
  }),
  entityType: { color: "#61708a", fontSize: "0.82rem", marginLeft: "0.4rem" },
  actions: { display: "flex", gap: "0.5rem" },
  primary: (disabled: boolean) => ({
    padding: "0.45rem 0.9rem",
    borderRadius: "8px",
    border: "1px solid #2f6feb",
    background: "#2f6feb",
    color: "#fff",
    font: "inherit",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? "0.5" : "1",
  }),
  ghost: { padding: "0.45rem 0.9rem", borderRadius: "8px", border: "1px solid #d9dde3", background: "#fff", font: "inherit", cursor: "pointer" },
  bannerSuccess: { padding: "0.6rem 0.75rem", borderRadius: "8px", fontSize: "0.9rem", background: "#e5f4ec", color: "#1f7a47", border: "1px solid #bfe3cd" },
  bannerError: { padding: "0.6rem 0.75rem", borderRadius: "8px", fontSize: "0.9rem", background: "#fdeaea", color: "#a92f2f", border: "1px solid #f3c9c9" },
  muted: { color: "#61708a" },
} as const;
