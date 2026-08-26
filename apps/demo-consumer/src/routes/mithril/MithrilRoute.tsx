import { useCallback, useEffect, useRef, useState } from "react";
import {
  mountFunctionalAction,
  type MithrilFunctionalUIInstance,
  type FunctionalUIResult,
} from "@functional-ui-poc/mithril";
import { MithrilFunctionalAction } from "@functional-ui-poc/mithril/react";
import type { FunctionalUIApi } from "@functional-ui-poc/shared-contract";
import { useApi } from "../../app/ApiProvider";
import { DebugPanel } from "../../components/DebugPanel";
import { TechPage } from "../../components/TechPage";
import { WorkflowSection } from "../../components/WorkflowSection";
import { useDebugLog } from "../../components/useDebugLog";
import { ProsCons } from "../../components/ProsCons";
import { TECH_NOTES } from "../../components/tech-notes";
import { DEMO_INPUT } from "../../demo-input";

/**
 * Programmatic-mount section: a React-owned container into which we call the
 * package's framework-neutral `mountFunctionalAction()` directly and tear it
 * down with the returned `destroy()` handle. No React wrapper, no Mithril in the
 * host's mental model — just mount and callbacks.
 */
function MithrilProgrammaticMount({
  api,
  onSuccess,
}: {
  api: FunctionalUIApi;
  onSuccess: (result: FunctionalUIResult) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = hostRef.current;
    if (!target) return;

    const instance: MithrilFunctionalUIInstance = mountFunctionalAction({
      target,
      input: DEMO_INPUT,
      api,
      onSuccess,
    });

    return () => instance.destroy();
  }, [api, onSuccess]);

  return <div ref={hostRef} />;
}

export function MithrilRoute() {
  const api = useApi();

  const mountLog = useDebugLog();
  const reactLog = useDebugLog();
  const [mountResult, setMountResult] = useState<FunctionalUIResult>();
  const [reactResult, setReactResult] = useState<FunctionalUIResult>();
  const [mountKey, setMountKey] = useState(0);
  const [reactKey, setReactKey] = useState(0);

  const { log: logMount, clear: clearMount } = mountLog;
  const { log: logReact, clear: clearReact } = reactLog;

  const onMountSuccess = useCallback(
    (result: FunctionalUIResult) => {
      logMount(`onSuccess → ${result.selectedEntityId}`);
      setMountResult(result);
    },
    [logMount]
  );

  const onReactSuccess = useCallback(
    (result: FunctionalUIResult) => {
      logReact(`onSuccess → ${result.selectedEntityId}`);
      setReactResult(result);
    },
    [logReact]
  );

  const resetMount = () => {
    clearMount();
    setMountResult(undefined);
    setMountKey((key) => key + 1);
  };

  const resetReact = () => {
    clearReact();
    setReactResult(undefined);
    setReactKey((key) => key + 1);
  };

  return (
    <TechPage
      name="Mithril"
      summary={`Runs the "${DEMO_INPUT.actionId}" workflow via a framework-neutral mount API.`}
    >
      <ProsCons {...TECH_NOTES.mithril} />

      <WorkflowSection
        mode="Programmatic mount"
        note="Calls mountFunctionalAction() into a React-owned container and tears down with destroy()."
      >
        <MithrilProgrammaticMount
          key={mountKey}
          api={api}
          onSuccess={onMountSuccess}
        />
        <DebugPanel
          entries={mountLog.entries}
          result={mountResult}
          onReset={resetMount}
        />
      </WorkflowSection>

      <WorkflowSection
        mode="React wrapper"
        note="Renders <MithrilFunctionalAction>, the thin React bridge over the mount API."
      >
        <MithrilFunctionalAction
          key={reactKey}
          input={DEMO_INPUT}
          api={api}
          onSuccess={onReactSuccess}
        />
        <DebugPanel
          entries={reactLog.entries}
          result={reactResult}
          onReset={resetReact}
        />
      </WorkflowSection>
    </TechPage>
  );
}
