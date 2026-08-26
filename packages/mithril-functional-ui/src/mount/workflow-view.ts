import m from "mithril";
import * as actions from "../core/workflow-actions.js";
import { canSubmit, type WorkflowStore } from "../core/workflow-store.js";
import { styles } from "./styles.js";
import { renderEntityList } from "./entity-list.js";

/** Maps the current workflow state to the body of the mounted component. */
export function renderWorkflow(store: WorkflowStore): m.Children {
  const { state } = store;

  switch (state.status) {
    case "idle":
    case "loading":
      return m("p", { style: styles.muted, "data-role": "loading" }, "Loading entities…");

    case "submitting":
      return [
        renderEntityList(store, true),
        m("p", { style: styles.muted, "data-role": "submitting" }, "Executing action…"),
      ];

    case "error":
      return [
        m("div", { style: styles.bannerError, "data-role": "error" }, state.errorMessage ?? "Something went wrong."),
        m("div", { style: styles.actions }, [
          m("button", { style: styles.primary(false), "data-action": "retry", onclick: () => actions.retry(store) }, "Retry"),
          m("button", { style: styles.ghost, "data-action": "reset", onclick: () => actions.reset(store) }, "Reset"),
        ]),
      ];

    case "success":
      return [
        m("div", { style: styles.bannerSuccess, "data-role": "success" }, `Action complete for entity ${state.result?.selectedEntityId ?? ""}.`),
        m("div", { style: styles.actions }, m("button", { style: styles.ghost, "data-action": "reset", onclick: () => actions.reset(store) }, "Run again")),
      ];

    case "ready":
      return [
        renderEntityList(store, false),
        m("div", { style: styles.actions }, [
          m("button", { style: styles.primary(!canSubmit(store)), "data-action": "submit", disabled: !canSubmit(store), onclick: () => actions.submit(store) }, "Confirm selection"),
          m("button", { style: styles.ghost, "data-action": "reset", onclick: () => actions.reset(store) }, "Reset"),
        ]),
      ];

    default:
      return null;
  }
}
