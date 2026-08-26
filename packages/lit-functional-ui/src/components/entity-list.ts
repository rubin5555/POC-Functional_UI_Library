import { html } from "lit";
import type { FunctionalWorkflowController } from "../core/workflow-controller.js";
import * as actions from "../core/workflow-actions.js";

/** Renders the selectable entity list (or an empty-state message). */
export function renderEntityList(
  controller: FunctionalWorkflowController,
  disabled: boolean
) {
  if (controller.entities.length === 0) {
    return html`<p class="muted" data-role="empty">No entities available.</p>`;
  }
  return html`
    <ul class="entities">
      ${controller.entities.map(
        (entity) => html`
          <li>
            <button
              class="entity"
              data-entity-id=${entity.id}
              aria-pressed=${controller.selectedEntityId === entity.id}
              ?disabled=${disabled}
              @click=${() => actions.select(controller, entity.id)}
            >
              ${entity.name}<span class="entity__type">${entity.type}</span>
            </button>
          </li>
        `
      )}
    </ul>
  `;
}
