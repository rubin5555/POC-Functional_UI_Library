import { html, nothing } from "lit";
import type { FunctionalWorkflowController } from "../core/workflow-controller.js";
import * as actions from "../core/workflow-actions.js";
import { renderEntityList } from "./entity-list.js";

/** Maps the current workflow state to the body of the component. */
export function renderWorkflow(controller: FunctionalWorkflowController) {
  switch (controller.status) {
    case "idle":
    case "loading":
      return html`<p class="muted" data-role="loading">Loading entities…</p>`;

    case "submitting":
      return html`
        ${renderEntityList(controller, true)}
        <p class="muted" data-role="submitting">Executing action…</p>
      `;

    case "error":
      return html`
        <div class="banner banner--error" data-role="error">
          ${controller.errorMessage ?? "Something went wrong."}
        </div>
        <div class="actions">
          <button class="primary" data-action="retry" @click=${() => actions.retry(controller)}>Retry</button>
          <button class="ghost" data-action="reset" @click=${() => actions.reset(controller)}>Reset</button>
        </div>
      `;

    case "success":
      return html`
        <div class="banner banner--success" data-role="success">
          Action complete for entity <strong>${controller.result?.selectedEntityId}</strong>.
        </div>
        <div class="actions">
          <button class="ghost" data-action="reset" @click=${() => actions.reset(controller)}>Run again</button>
        </div>
      `;

    case "ready":
      return html`
        ${renderEntityList(controller, false)}
        <div class="actions">
          <button class="primary" data-action="submit" ?disabled=${!controller.canSubmit} @click=${() => actions.submit(controller)}>
            Confirm selection
          </button>
          <button class="ghost" data-action="reset" @click=${() => actions.reset(controller)}>Reset</button>
        </div>
      `;

    default:
      return nothing;
  }
}
