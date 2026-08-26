import m from "mithril";
import * as actions from "../core/workflow-actions.js";
import type { WorkflowStore } from "../core/workflow-store.js";
import { styles } from "./styles.js";

/** Renders the selectable entity list (or an empty-state message). */
export function renderEntityList(store: WorkflowStore, disabled: boolean): m.Children {
  const { state } = store;
  if (state.entities.length === 0) {
    return m("p", { style: styles.muted, "data-role": "empty" }, "No entities available.");
  }
  return m(
    "ul",
    { style: styles.list },
    state.entities.map((entity) =>
      m(
        "li",
        { key: entity.id },
        m(
          "button.entity",
          {
            "data-entity-id": entity.id,
            // Mithril renders a boolean attribute value as "", so emit a string.
            "aria-pressed": state.selectedEntityId === entity.id ? "true" : "false",
            disabled,
            style: styles.entity(state.selectedEntityId === entity.id, disabled),
            onclick: () => actions.select(store, entity.id),
          },
          entity.name,
          m("span", { style: styles.entityType }, entity.type)
        )
      )
    )
  );
}
