import {
  FunctionalActionLit,
  FUNCTIONAL_ACTION_LIT_TAG,
} from "./components/functional-action-lit.js";

/**
 * Registers `<functional-action-lit>`. Safe to call repeatedly and safe to
 * import more than once — it no-ops if the tag is already defined, so multiple
 * bundles/consumers can't collide. This module has no import-time side effects;
 * the `/register` entrypoint is what auto-registers.
 */
export function registerFunctionalActionLit(
  tagName: string = FUNCTIONAL_ACTION_LIT_TAG
): void {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, FunctionalActionLit);
  }
}
