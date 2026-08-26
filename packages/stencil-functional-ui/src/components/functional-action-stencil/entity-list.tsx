import { h } from "@stencil/core";
import type { FunctionalActionStencil } from "./functional-action-stencil";
import { select } from "./workflow";

/** Renders the selectable entity list (or an empty-state message). */
export function renderEntityList(c: FunctionalActionStencil, disabled: boolean) {
  if (c.entities.length === 0) {
    return (
      <p class="muted" data-role="empty">
        No entities available.
      </p>
    );
  }
  return (
    <ul class="entities">
      {c.entities.map((entity) => (
        <li key={entity.id}>
          <button
            class="entity"
            data-entity-id={entity.id}
            aria-pressed={c.selectedEntityId === entity.id ? "true" : "false"}
            disabled={disabled}
            onClick={() => select(c, entity.id)}
          >
            {entity.name}
            <span class="entity__type">{entity.type}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
