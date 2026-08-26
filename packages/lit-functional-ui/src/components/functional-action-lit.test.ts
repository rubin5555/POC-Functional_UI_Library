import { afterEach, describe, expect, it, vi } from "vitest";
import { createMockApi } from "@functional-ui-poc/shared-contract";
import type { FunctionalUIResult } from "@functional-ui-poc/shared-contract";
import { FunctionalActionLit } from "./functional-action-lit.js";
import { registerFunctionalActionLit } from "../register-element.js";
import { FUNCTIONAL_UI_SUCCESS_EVENT } from "../events.js";

registerFunctionalActionLit();

const INPUT = { actionId: "create-related-entity" };

/** Let pending timers (mock delay) and Lit's async render settle. */
async function flush(el: FunctionalActionLit): Promise<void> {
  for (let i = 0; i < 4; i++) {
    await new Promise((resolve) => setTimeout(resolve, 0));
    await el.updateComplete;
  }
}

function mount(api = createMockApi({ delayMs: 0 })): FunctionalActionLit {
  const el = document.createElement("functional-action-lit") as FunctionalActionLit;
  el.api = api;
  el.input = INPUT;
  document.body.appendChild(el);
  return el;
}

function shadow(el: FunctionalActionLit): ShadowRoot {
  if (!el.shadowRoot) throw new Error("no shadow root");
  return el.shadowRoot;
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("<functional-action-lit>", () => {
  it("enters loading immediately when configured", async () => {
    const el = mount();
    await el.updateComplete;
    expect(shadow(el).querySelector('[data-status="loading"]')).not.toBeNull();
  });

  it("shows entities once loaded (ready state)", async () => {
    const el = mount();
    await flush(el);
    expect(shadow(el).querySelector('[data-status="ready"]')).not.toBeNull();
    expect(shadow(el).querySelectorAll("button.entity").length).toBeGreaterThan(0);
  });

  it("lets the user select an entity", async () => {
    const el = mount();
    await flush(el);
    const first = shadow(el).querySelector<HTMLButtonElement>("button.entity")!;
    first.click();
    await el.updateComplete;
    expect(first.getAttribute("aria-pressed")).toBe("true");
  });

  it("keeps submit disabled until an entity is selected", async () => {
    const el = mount();
    await flush(el);
    const submit = shadow(el).querySelector<HTMLButtonElement>('[data-action="submit"]')!;
    expect(submit.disabled).toBe(true);

    shadow(el).querySelector<HTMLButtonElement>("button.entity")!.click();
    await el.updateComplete;
    expect(submit.disabled).toBe(false);
  });

  it("submits, triggers the API, and emits a typed success event", async () => {
    const api = createMockApi({ delayMs: 0 });
    const executeSpy = vi.spyOn(api, "executeAction");
    const el = mount(api);
    await flush(el);

    let received: FunctionalUIResult | null = null;
    el.addEventListener(FUNCTIONAL_UI_SUCCESS_EVENT, (event) => {
      received = (event as CustomEvent<FunctionalUIResult>).detail;
    });

    const firstEntity = shadow(el).querySelector<HTMLButtonElement>("button.entity")!;
    const selectedId = firstEntity.getAttribute("data-entity-id");
    firstEntity.click();
    await el.updateComplete;
    shadow(el).querySelector<HTMLButtonElement>('[data-action="submit"]')!.click();
    await flush(el);

    expect(executeSpy).toHaveBeenCalledOnce();
    expect(shadow(el).querySelector('[data-status="success"]')).not.toBeNull();
    expect(received).toEqual({
      actionId: INPUT.actionId,
      selectedEntityId: selectedId,
      status: "success",
    });
  });

  it("displays an error state when the API fails", async () => {
    const el = mount(createMockApi({ delayMs: 0, failGetEntities: true }));
    await flush(el);
    expect(shadow(el).querySelector('[data-role="error"]')).not.toBeNull();
  });

  it("aborts in-flight work and emits nothing after teardown", async () => {
    const api = createMockApi({ delayMs: 50 });
    const el = mount(api);
    const onSuccess = vi.fn();
    el.addEventListener(FUNCTIONAL_UI_SUCCESS_EVENT, onSuccess);

    // Remove before the load resolves; disconnect should abort the request.
    el.remove();
    await new Promise((resolve) => setTimeout(resolve, 80));

    expect(onSuccess).not.toHaveBeenCalled();
  });
});
