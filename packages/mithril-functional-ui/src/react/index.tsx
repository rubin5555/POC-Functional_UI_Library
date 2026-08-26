import { useEffect, useRef } from "react";
import type {
  FunctionalUIApi,
  FunctionalUIInput,
  FunctionalUIResult,
} from "@functional-ui-poc/shared-contract";
import {
  mountFunctionalAction,
  type MithrilFunctionalUIInstance,
} from "../mount/mount-functional-action.js";

export type MithrilFunctionalActionProps = {
  input: FunctionalUIInput;
  api: FunctionalUIApi;
  onSuccess?: (result: FunctionalUIResult) => void;
  className?: string;
};

/**
 * Thin React bridge over the framework-neutral mount API.
 *
 * Update-vs-remount policy (documented per the spec):
 * - It **mounts** the Mithril instance into a React-owned `div` after mount and
 *   **destroys** it on unmount.
 * - On an `input` change it **updates in place** via `instance.update(input)`.
 * - On an `api` change it **remounts** (the mount effect's dependency), because
 *   the API client is fixed for the lifetime of a mounted instance.
 * - `onSuccess` is read through a ref, so changing the callback never remounts.
 */
export function MithrilFunctionalAction({
  input,
  api,
  onSuccess,
  className,
}: MithrilFunctionalActionProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<MithrilFunctionalUIInstance | null>(null);
  const appliedInput = useRef(input);

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  useEffect(() => {
    const target = hostRef.current;
    if (!target) return;

    const instance = mountFunctionalAction({
      target,
      input,
      api,
      onSuccess: (result) => onSuccessRef.current?.(result),
    });
    instanceRef.current = instance;
    appliedInput.current = input;

    return () => {
      instance.destroy();
      instanceRef.current = null;
    };
    // Remount only when the API client changes; input is handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api]);

  useEffect(() => {
    if (appliedInput.current !== input) {
      appliedInput.current = input;
      instanceRef.current?.update(input);
    }
  }, [input]);

  return <div ref={hostRef} className={className} />;
}
