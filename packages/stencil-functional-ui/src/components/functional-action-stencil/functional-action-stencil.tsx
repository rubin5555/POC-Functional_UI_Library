import {
  Component,
  Prop,
  State,
  Event,
  EventEmitter,
  Watch,
  Host,
  h,
} from "@stencil/core";
import type {
  Entity,
  FunctionalUIApi,
  FunctionalUIInput,
  FunctionalUIResult,
  FunctionalUIState,
} from "@functional-ui-poc/shared-contract";
import { maybeStart } from "./workflow";
import { renderWorkflow } from "./workflow-view";

/**
 * `<functional-action-stencil>` — typed props (`input`, `api`) and a typed event
 * (`functionalUiSuccess`), Shadow DOM, cleanup on disconnect. State lives in
 * `@State` fields; transitions live in `workflow.ts` and the view in
 * `workflow-view.tsx`, so the component stays a small declarative shell.
 */
@Component({
  tag: "functional-action-stencil",
  styleUrl: "functional-action-stencil.css",
  shadow: true,
})
export class FunctionalActionStencil {
  @Prop() input?: FunctionalUIInput;
  @Prop() api?: FunctionalUIApi;

  @Event() functionalUiSuccess!: EventEmitter<FunctionalUIResult>;

  @State() status: FunctionalUIState = "idle";
  @State() entities: Entity[] = [];
  @State() selectedEntityId: string | null = null;
  @State() result: FunctionalUIResult | null = null;
  @State() errorMessage: string | null = null;

  inflight: AbortController | null = null;
  failedStep: "load" | "submit" | null = null;

  componentWillLoad() {
    maybeStart(this);
  }

  disconnectedCallback() {
    this.inflight?.abort();
    this.inflight = null;
  }

  @Watch("input")
  @Watch("api")
  onConfigChanged() {
    maybeStart(this);
  }

  render() {
    return (
      <Host>
        <div class="panel" data-status={this.status}>
          <span class="status">State: {this.status}</span>
          {renderWorkflow(this)}
        </div>
      </Host>
    );
  }
}
