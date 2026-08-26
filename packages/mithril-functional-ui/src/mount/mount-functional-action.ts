import m from "mithril";
import type {
  FunctionalUIApi,
  FunctionalUIInput,
  FunctionalUIResult,
} from "@functional-ui-poc/shared-contract";
import { createWorkflowStore, destroyStore } from "../core/workflow-store.js";
import * as actions from "../core/workflow-actions.js";
import { styles } from "./styles.js";
import { renderWorkflow } from "./workflow-view.js";

export type MountFunctionalActionOptions = {
  /** A caller-owned DOM node to mount into. */
  target: HTMLElement;
  input: FunctionalUIInput;
  api: FunctionalUIApi;
  /** Called with the result when the workflow succeeds. */
  onSuccess?: (result: FunctionalUIResult) => void;
};

/**
 * The handle returned to the host. The host never learns Mithril is involved —
 * it only mounts, optionally updates the input, and destroys.
 */
export type MithrilFunctionalUIInstance = {
  destroy(): void;
  update(input: FunctionalUIInput): void;
};

/**
 * Mounts the workflow into `target` and returns a framework-neutral handle.
 * Mithril's redraw is global, but each mount owns an isolated store, so multiple
 * instances render independently.
 */
export function mountFunctionalAction(
  options: MountFunctionalActionOptions
): MithrilFunctionalUIInstance {
  const { target, input, api, onSuccess } = options;

  const store = createWorkflowStore({
    input,
    api,
    onChange: () => m.redraw(),
    onSuccess: (result) => onSuccess?.(result),
  });

  const component: m.Component = {
    view: () =>
      m("div.functional-action-mithril", { style: styles.panel, "data-status": store.state.status }, [
        m("span", { style: styles.status }, `State: ${store.state.status}`),
        renderWorkflow(store),
      ]),
  };

  // Start before mounting so the first render is already `loading` (no idle flash).
  actions.start(store);
  m.mount(target, component);

  return {
    update(nextInput: FunctionalUIInput): void {
      actions.update(store, nextInput);
      m.redraw();
    },
    destroy(): void {
      destroyStore(store);
      m.mount(target, null);
    },
  };
}
