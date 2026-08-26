import { LitElement, html, type PropertyValues } from "lit";
import { property } from "lit/decorators.js";
import type {
  FunctionalUIApi,
  FunctionalUIInput,
  FunctionalUIResult,
} from "@functional-ui-poc/shared-contract";
import { FUNCTIONAL_UI_SUCCESS_EVENT } from "../events.js";
import { FunctionalWorkflowController } from "../core/workflow-controller.js";
import * as actions from "../core/workflow-actions.js";
import { functionalActionStyles } from "./functional-action.styles.js";
import { renderWorkflow } from "./workflow-view.js";

/** The custom element tag name. */
export const FUNCTIONAL_ACTION_LIT_TAG = "functional-action-lit";

/**
 * `<functional-action-lit>` — configuration arrives via JS properties
 * (`input`, `api`); success is reported via a composed `functional-ui-success`
 * CustomEvent. State/API lives in the controller, view in `workflow-view.ts`;
 * this class only wires them together, reacts to prop changes, and emits.
 */
export class FunctionalActionLit extends LitElement {
  static override styles = functionalActionStyles;

  @property({ attribute: false }) input?: FunctionalUIInput;
  @property({ attribute: false }) api?: FunctionalUIApi;

  private readonly workflow = new FunctionalWorkflowController(this, (result) =>
    this.emitSuccess(result)
  );

  override willUpdate(changed: PropertyValues<this>): void {
    if ((changed.has("input") || changed.has("api")) && this.input && this.api) {
      this.workflow.configure(this.input, this.api);
      void actions.start(this.workflow);
    }
  }

  /** Public imperative API: restart the workflow from a fresh state. */
  reset(): void {
    actions.reset(this.workflow);
  }

  private emitSuccess(result: FunctionalUIResult): void {
    this.dispatchEvent(
      new CustomEvent<FunctionalUIResult>(FUNCTIONAL_UI_SUCCESS_EVENT, {
        detail: result,
        bubbles: true,
        composed: true,
      })
    );
  }

  override render() {
    return html`
      <div class="panel" data-status=${this.workflow.status}>
        <span class="status">State: ${this.workflow.status}</span>
        ${renderWorkflow(this.workflow)}
      </div>
    `;
  }
}
