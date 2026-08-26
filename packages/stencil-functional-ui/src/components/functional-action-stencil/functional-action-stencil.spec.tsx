import { newSpecPage } from "@stencil/core/testing";
import { FunctionalActionStencil } from "./functional-action-stencil";

// The Stencil integrated test runner is Jest (CJS) and does not resolve the
// ESM-only shared-contract workspace package cleanly, so this spec uses a local
// mock that mirrors the shared contract's behavior. (A Stencil-tooling finding
// worth noting in the comparison.)
type Entity = { id: string; name: string; type: string };

function createLocalMockApi(options: { delayMs?: number; failGetEntities?: boolean } = {}) {
  const { delayMs = 0, failGetEntities = false } = options;
  const entities: Entity[] = [
    { id: "acct-001", name: "Acme Corporation", type: "account" },
    { id: "acct-002", name: "Globex Industries", type: "account" },
  ];
  const delay = (ms: number, signal?: AbortSignal) =>
    new Promise<void>((resolve, reject) => {
      if (signal?.aborted) return reject(new DOMException("aborted", "AbortError"));
      const timer = setTimeout(resolve, ms);
      signal?.addEventListener("abort", () => {
        clearTimeout(timer);
        reject(new DOMException("aborted", "AbortError"));
      });
    });

  return {
    async getEntities({ signal }: { actionId: string; signal?: AbortSignal }) {
      await delay(delayMs, signal);
      if (failGetEntities) throw new Error("Failed to load entities.");
      return entities.map((entity) => ({ ...entity }));
    },
    async executeAction({
      actionId,
      selectedEntityId,
      signal,
    }: {
      actionId: string;
      selectedEntityId: string;
      signal?: AbortSignal;
    }) {
      await delay(delayMs, signal);
      return { actionId, selectedEntityId, status: "success" as const };
    },
  };
}

const INPUT = { actionId: "create-related-entity" };

async function setup(api = createLocalMockApi({ delayMs: 0 })) {
  const page = await newSpecPage({
    components: [FunctionalActionStencil],
    html: `<functional-action-stencil></functional-action-stencil>`,
  });
  const el = page.root as HTMLElement & { api: unknown; input: unknown };
  el.api = api;
  el.input = INPUT;
  await page.waitForChanges();
  return { page, el };
}

async function settle(page: Awaited<ReturnType<typeof newSpecPage>>) {
  for (let i = 0; i < 4; i++) {
    await new Promise((resolve) => setTimeout(resolve, 0));
    await page.waitForChanges();
  }
}

function shadow(el: HTMLElement): ShadowRoot {
  if (!el.shadowRoot) throw new Error("no shadow root");
  return el.shadowRoot;
}

describe("functional-action-stencil", () => {
  it("enters loading immediately when configured", async () => {
    const { page, el } = await setup();
    expect(shadow(el).querySelector('[data-status="loading"]')).not.toBeNull();
    await settle(page);
  });

  it("shows entities once loaded (ready state)", async () => {
    const { page, el } = await setup();
    await settle(page);
    expect(shadow(el).querySelector('[data-status="ready"]')).not.toBeNull();
    expect(shadow(el).querySelectorAll("button.entity").length).toBeGreaterThan(0);
  });

  it("lets the user select an entity and enables submit", async () => {
    const { page, el } = await setup();
    await settle(page);

    // Read the reflected attribute; the mock-doc button has no `.disabled` prop.
    const submit = () =>
      shadow(el).querySelector('[data-action="submit"]') as HTMLButtonElement;
    expect(submit().hasAttribute("disabled")).toBe(true);

    (shadow(el).querySelector("button.entity") as HTMLButtonElement).click();
    await page.waitForChanges();

    expect(
      shadow(el).querySelector("button.entity")!.getAttribute("aria-pressed")
    ).toBe("true");
    expect(submit().hasAttribute("disabled")).toBe(false);
  });

  it("submits, triggers the API, and emits a typed success event", async () => {
    const api = createLocalMockApi({ delayMs: 0 });
    const executeSpy = jest.spyOn(api, "executeAction");
    const { page, el } = await setup(api);
    await settle(page);

    let received: { actionId: string; selectedEntityId: string; status: string } | null = null;
    el.addEventListener("functionalUiSuccess", (event) => {
      received = (event as CustomEvent).detail;
    });

    const firstEntity = shadow(el).querySelector("button.entity") as HTMLButtonElement;
    const selectedId = firstEntity.getAttribute("data-entity-id");
    firstEntity.click();
    await page.waitForChanges();
    (shadow(el).querySelector('[data-action="submit"]') as HTMLButtonElement).click();
    await settle(page);

    expect(executeSpy).toHaveBeenCalledTimes(1);
    expect(shadow(el).querySelector('[data-status="success"]')).not.toBeNull();
    expect(received).toEqual({
      actionId: INPUT.actionId,
      selectedEntityId: selectedId,
      status: "success",
    });
  });

  it("displays an error state when the API fails", async () => {
    const { page, el } = await setup(createLocalMockApi({ delayMs: 0, failGetEntities: true }));
    await settle(page);
    expect(shadow(el).querySelector('[data-role="error"]')).not.toBeNull();
  });

  it("retries after an error", async () => {
    const { page, el } = await setup(createLocalMockApi({ delayMs: 0, failGetEntities: true }));
    await settle(page);
    expect(shadow(el).querySelector('[data-role="error"]')).not.toBeNull();

    (el as unknown as { api: unknown }).api = createLocalMockApi({ delayMs: 0 });
    await page.waitForChanges();
    (shadow(el).querySelector('[data-action="retry"]') as HTMLButtonElement).click();
    await settle(page);
    expect(shadow(el).querySelector('[data-status="ready"]')).not.toBeNull();
  });

  it("cleans up on disconnect and emits nothing afterward", async () => {
    const { page, el } = await setup(createLocalMockApi({ delayMs: 50 }));
    const onSuccess = jest.fn();
    el.addEventListener("functionalUiSuccess", onSuccess);

    el.remove();
    await new Promise((resolve) => setTimeout(resolve, 80));
    await page.waitForChanges();

    expect(onSuccess).not.toHaveBeenCalled();
  });
});
