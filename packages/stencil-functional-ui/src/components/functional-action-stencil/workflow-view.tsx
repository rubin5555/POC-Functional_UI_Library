import { h } from "@stencil/core";
import type { FunctionalActionStencil } from "./functional-action-stencil";
import { canSubmit, retry, reset, submit } from "./workflow";
import { renderEntityList } from "./entity-list";

/** Maps the current workflow state to the body of the component. */
export function renderWorkflow(c: FunctionalActionStencil) {
  switch (c.status) {
    case "idle":
    case "loading":
      return (
        <p class="muted" data-role="loading">
          Loading entities…
        </p>
      );

    case "submitting":
      return [
        renderEntityList(c, true),
        <p class="muted" data-role="submitting">
          Executing action…
        </p>,
      ];

    case "error":
      return [
        <div class="banner banner--error" data-role="error">
          {c.errorMessage ?? "Something went wrong."}
        </div>,
        <div class="actions">
          <button class="primary" data-action="retry" onClick={() => retry(c)}>
            Retry
          </button>
          <button class="ghost" data-action="reset" onClick={() => reset(c)}>
            Reset
          </button>
        </div>,
      ];

    case "success":
      return [
        <div class="banner banner--success" data-role="success">
          Action complete for entity <strong>{c.result?.selectedEntityId}</strong>.
        </div>,
        <div class="actions">
          <button class="ghost" data-action="reset" onClick={() => reset(c)}>
            Run again
          </button>
        </div>,
      ];

    case "ready":
      return [
        renderEntityList(c, false),
        <div class="actions">
          <button class="primary" data-action="submit" disabled={!canSubmit(c)} onClick={() => submit(c)}>
            Confirm selection
          </button>
          <button class="ghost" data-action="reset" onClick={() => reset(c)}>
            Reset
          </button>
        </div>,
      ];

    default:
      return null;
  }
}
