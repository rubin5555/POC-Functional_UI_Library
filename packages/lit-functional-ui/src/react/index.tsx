import { createElement, useEffect, useRef } from "react";
import type {
  FunctionalUIApi,
  FunctionalUIInput,
  FunctionalUIResult,
} from "@functional-ui-poc/shared-contract";
import type { FunctionalActionLit } from "../components/functional-action-lit.js";
import { FUNCTIONAL_ACTION_LIT_TAG } from "../components/functional-action-lit.js";
import { FUNCTIONAL_UI_SUCCESS_EVENT } from "../events.js";
// Side-effect: ensure the custom element is registered before React renders it.
import "../register.js";

export type LitFunctionalActionProps = {
  input: FunctionalUIInput;
  api: FunctionalUIApi;
  onSuccess?: (result: FunctionalUIResult) => void;
  className?: string;
};

/**
 * Thin React wrapper over `<functional-action-lit>`. It assigns the object
 * props directly to the element, bridges the `functional-ui-success`
 * CustomEvent to a typed `onSuccess` callback, and forwards `className` — but it
 * does NOT re-implement any of the workflow; that all lives in the element.
 */
export function LitFunctionalAction({
  input,
  api,
  onSuccess,
  className,
}: LitFunctionalActionProps) {
  const ref = useRef<FunctionalActionLit>(null);

  // Complex values must be assigned as properties, not attributes.
  useEffect(() => {
    if (ref.current) ref.current.input = input;
  }, [input]);

  useEffect(() => {
    if (ref.current) ref.current.api = api;
  }, [api]);

  // Forward className to the host element's class.
  useEffect(() => {
    if (ref.current) ref.current.className = className ?? "";
  }, [className]);

  // Bridge the CustomEvent to the typed React callback.
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handler = (event: Event) => {
      onSuccess?.((event as CustomEvent<FunctionalUIResult>).detail);
    };

    element.addEventListener(FUNCTIONAL_UI_SUCCESS_EVENT, handler);
    return () => element.removeEventListener(FUNCTIONAL_UI_SUCCESS_EVENT, handler);
  }, [onSuccess]);

  return createElement(FUNCTIONAL_ACTION_LIT_TAG, { ref });
}
