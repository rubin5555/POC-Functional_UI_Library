import type { Entity } from "./types.js";

/**
 * Deterministic entity fixtures keyed by `actionId`. Unknown action ids fall
 * back to a default set so any actionId the demo throws at the mock resolves to
 * a stable, repeatable list.
 */
const ENTITIES_BY_ACTION: Record<string, Entity[]> = {
  "create-related-entity": [
    { id: "acct-001", name: "Acme Corporation", type: "account" },
    { id: "acct-002", name: "Globex Industries", type: "account" },
    { id: "acct-003", name: "Initech LLC", type: "account" },
    { id: "contact-114", name: "Dana Whitfield", type: "contact" },
    { id: "contact-227", name: "Priya Nair", type: "contact" },
  ],
};

const DEFAULT_ENTITIES: Entity[] = [
  { id: "entity-1", name: "First Entity", type: "generic" },
  { id: "entity-2", name: "Second Entity", type: "generic" },
  { id: "entity-3", name: "Third Entity", type: "generic" },
];

/** Returns a fresh copy of the deterministic entity list for an action id. */
export function getMockEntities(actionId: string): Entity[] {
  const entities = ENTITIES_BY_ACTION[actionId] ?? DEFAULT_ENTITIES;
  return entities.map((entity) => ({ ...entity }));
}
