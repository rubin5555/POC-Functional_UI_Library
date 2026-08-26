import { useCallback, useEffect, useRef, useState } from "react";
// Registration entrypoint — side-effect import, exactly as an external consumer would.
import "@functional-ui-poc/lit/register";
import {
  FUNCTIONAL_ACTION_LIT_TAG,
  FUNCTIONAL_UI_SUCCESS_EVENT,
  type FunctionalActionLit,
  type FunctionalUIResult,
} from "@functional-ui-poc/lit";
import { LitFunctionalAction } from "@functional-ui-poc/lit/react";
import { useApi } from "../../app/ApiProvider";
import { DebugPanel } from "../../components/DebugPanel";
import { TechPage } from "../../components/TechPage";
import { WorkflowSection } from "../../components/WorkflowSection";
import { useDebugLog } from "../../components/useDebugLog";
import { ProsCons } from "../../components/ProsCons";
import { TECH_NOTES } from "../../components/tech-notes";
import { DEMO_INPUT } from "../../demo-input";
import type { FunctionalUIApi } from "@functional-ui-poc/shared-contract";

/**
 * Native section: a React-owned container into which we manually create the Lit
 * custom element and wire its properties and CustomEvent — the raw
 * web-component boundary, no React wrapper involved.
 */
function LitNativeMount({
  api,
  onSuccess,
}: {
  api: FunctionalUIApi;
  onSuccess: (result: FunctionalUIResult) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const element = document.createElement(
      FUNCTIONAL_ACTION_LIT_TAG
    ) as FunctionalActionLit;
    element.api = api;
    element.input = DEMO_INPUT;

    const handler = (event: Event) => {
      onSuccess((event as CustomEvent<FunctionalUIResult>).detail);
    };
    element.addEventListener(FUNCTIONAL_UI_SUCCESS_EVENT, handler);
    host.appendChild(element);

    return () => {
      element.removeEventListener(FUNCTIONAL_UI_SUCCESS_EVENT, handler);
      element.remove();
    };
  }, [api, onSuccess]);

  return <div ref={hostRef} />;
}

export function LitRoute() {
  const api = useApi();

  const native = useDebugLog();
  const react = useDebugLog();
  const [nativeResult, setNativeResult] = useState<FunctionalUIResult>();
  const [reactResult, setReactResult] = useState<FunctionalUIResult>();
  const [nativeKey, setNativeKey] = useState(0);
  const [reactKey, setReactKey] = useState(0);

  const { log: logNative, clear: clearNative } = native;
  const { log: logReact, clear: clearReact } = react;

  const onNativeSuccess = useCallback(
    (result: FunctionalUIResult) => {
      logNative(`functional-ui-success → ${result.selectedEntityId}`);
      setNativeResult(result);
    },
    [logNative]
  );

  const onReactSuccess = useCallback(
    (result: FunctionalUIResult) => {
      logReact(`onSuccess → ${result.selectedEntityId}`);
      setReactResult(result);
    },
    [logReact]
  );

  const resetNative = () => {
    clearNative();
    setNativeResult(undefined);
    setNativeKey((key) => key + 1);
  };

  const resetReact = () => {
    clearReact();
    setReactResult(undefined);
    setReactKey((key) => key + 1);
  };

  return (
    <TechPage
      name="Lit"
      summary={`Runs the "${DEMO_INPUT.actionId}" workflow via a Lit custom element.`}
    >
      <ProsCons {...TECH_NOTES.lit} />

      <WorkflowSection
        mode="Native custom element"
        note="Renders <functional-action-lit> directly to verify the raw web-component boundary."
      >
        <LitNativeMount key={nativeKey} api={api} onSuccess={onNativeSuccess} />
        <DebugPanel
          entries={native.entries}
          result={nativeResult}
          onReset={resetNative}
        />
      </WorkflowSection>

      <WorkflowSection
        mode="React wrapper"
        note="Renders <LitFunctionalAction> to verify framework ergonomics."
      >
        <LitFunctionalAction
          key={reactKey}
          input={DEMO_INPUT}
          api={api}
          onSuccess={onReactSuccess}
        />
        <DebugPanel
          entries={react.entries}
          result={reactResult}
          onReset={resetReact}
        />
      </WorkflowSection>
    </TechPage>
  );
}
