import { afterEach, describe, expect, it, vi } from "vitest";
import { createMockApi } from "@functional-ui-poc/shared-contract";
import type { FunctionalUIResult } from "@functional-ui-poc/shared-contract";
import { mountFunctionalAction } from "./mount-functional-action.js";

const INPUT = { actionId: "create-related-entity" };

/** Let the mock delay, promise jobs, and Mithril's rAF redraw settle. */
async function flush(): Promise<void> {
  for (let i = 0; i < 5; i++) {
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
}

function makeTarget(): HTMLElement {
  const el = document.createElement("div");
  document.body.appendChild(el);
  return el;
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("mountFunctionalAction", () => {
  it("starts loading immediately", async () => {
    const target = makeTarget();
    const instance = mountFunctionalAction({ target, input: INPUT, api: createMockApi({ delayMs: 20 }) });
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(target.querySelector('[data-status="loading"]')).not.toBeNull();
    instance.destroy();
  });

  it("renders entities once loaded", async () => {
    const target = makeTarget();
    const instance = mountFunctionalAction({ target, input: INPUT, api: createMockApi({ delayMs: 0 }) });
    await flush();
    expect(target.querySelector('[data-status="ready"]')).not.toBeNull();
    expect(target.querySelectorAll("button.entity").length).toBeGreaterThan(0);
    instance.destroy();
  });

  it("lets the user select an entity and enables submit", async () => {
    const target = makeTarget();
    const instance = mountFunctionalAction({ target, input: INPUT, api: createMockApi({ delayMs: 0 }) });
    await flush();

    const submit = () => target.querySelector<HTMLButtonElement>('[data-action="submit"]')!;
    expect(submit().disabled).toBe(true);

    target.querySelector<HTMLButtonElement>("button.entity")!.click();
    await flush();
    expect(target.querySelector<HTMLButtonElement>("button.entity")!.getAttribute("aria-pressed")).toBe("true");
    expect(submit().disabled).toBe(false);
    instance.destroy();
  });

  it("submits, triggers the API, and calls onSuccess with the result", async () => {
    const target = makeTarget();
    const api = createMockApi({ delayMs: 0 });
    const executeSpy = vi.spyOn(api, "executeAction");
    let received: FunctionalUIResult | null = null;

    const instance = mountFunctionalAction({
      target,
      input: INPUT,
      api,
      onSuccess: (result) => {
        received = result;
      },
    });
    await flush();

    const firstEntity = target.querySelector<HTMLButtonElement>("button.entity")!;
    const selectedId = firstEntity.getAttribute("data-entity-id");
    firstEntity.click();
    await flush();
    target.querySelector<HTMLButtonElement>('[data-action="submit"]')!.click();
    await flush();

    expect(executeSpy).toHaveBeenCalledOnce();
    expect(target.querySelector('[data-status="success"]')).not.toBeNull();
    expect(received).toEqual({ actionId: INPUT.actionId, selectedEntityId: selectedId, status: "success" });
    instance.destroy();
  });

  it("shows an error state when the API fails", async () => {
    const target = makeTarget();
    const instance = mountFunctionalAction({
      target,
      input: INPUT,
      api: createMockApi({ delayMs: 0, failGetEntities: true }),
    });
    await flush();
    expect(target.querySelector('[data-role="error"]')).not.toBeNull();
    instance.destroy();
  });

  it("destroy tears down completely and emits nothing afterward", async () => {
    const target = makeTarget();
    const onSuccess = vi.fn();
    const instance = mountFunctionalAction({
      target,
      input: INPUT,
      api: createMockApi({ delayMs: 50 }),
      onSuccess,
    });

    instance.destroy();
    expect(target.children.length).toBe(0); // Mithril unmounted the target
    await flush();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("keeps multiple instances isolated", async () => {
    const targetA = makeTarget();
    const targetB = makeTarget();
    const a = mountFunctionalAction({ target: targetA, input: INPUT, api: createMockApi({ delayMs: 0 }) });
    const b = mountFunctionalAction({ target: targetB, input: INPUT, api: createMockApi({ delayMs: 0 }) });
    await flush();

    // Select in A only; B must remain unselected.
    targetA.querySelector<HTMLButtonElement>("button.entity")!.click();
    await flush();

    expect(targetA.querySelector('button.entity[aria-pressed="true"]')).not.toBeNull();
    expect(targetB.querySelector('button.entity[aria-pressed="true"]')).toBeNull();

    a.destroy();
    b.destroy();
  });
});
