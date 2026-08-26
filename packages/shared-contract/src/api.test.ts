import { describe, expect, it } from "vitest";
import { createMockApi } from "./api.js";

describe("createMockApi", () => {
  it("returns deterministic entities for an action", async () => {
    const api = createMockApi({ delayMs: 0 });
    const first = await api.getEntities({ actionId: "create-related-entity" });
    const second = await api.getEntities({ actionId: "create-related-entity" });

    expect(first.length).toBeGreaterThan(0);
    expect(first).toEqual(second);
    expect(first[0]).toMatchObject({ id: expect.any(String), name: expect.any(String) });
  });

  it("returns fresh copies so callers cannot mutate the fixtures", async () => {
    const api = createMockApi({ delayMs: 0 });
    const list = await api.getEntities({ actionId: "create-related-entity" });
    list[0]!.name = "MUTATED";

    const again = await api.getEntities({ actionId: "create-related-entity" });
    expect(again[0]!.name).not.toBe("MUTATED");
  });

  it("supports an empty-result state", async () => {
    const api = createMockApi({ delayMs: 0, emptyEntities: true });
    const list = await api.getEntities({ actionId: "create-related-entity" });
    expect(list).toEqual([]);
  });

  it("executes an action and returns a success result", async () => {
    const api = createMockApi({ delayMs: 0 });
    const result = await api.executeAction({
      actionId: "create-related-entity",
      selectedEntityId: "acct-001",
    });

    expect(result).toEqual({
      actionId: "create-related-entity",
      selectedEntityId: "acct-001",
      status: "success",
    });
  });

  it("can simulate a load error", async () => {
    const api = createMockApi({ delayMs: 0, failGetEntities: true });
    await expect(
      api.getEntities({ actionId: "create-related-entity" })
    ).rejects.toThrow(/Failed to load entities/);
  });

  it("can simulate a submit error", async () => {
    const api = createMockApi({ delayMs: 0, failExecuteAction: true });
    await expect(
      api.executeAction({ actionId: "x", selectedEntityId: "y" })
    ).rejects.toThrow(/Failed to execute action/);
  });

  it("rejects with AbortError when the signal aborts mid-flight", async () => {
    const api = createMockApi({ delayMs: 1000 });
    const controller = new AbortController();
    const pending = api.getEntities({
      actionId: "create-related-entity",
      signal: controller.signal,
    });
    controller.abort();

    await expect(pending).rejects.toMatchObject({ name: "AbortError" });
  });

  it("rejects immediately when the signal is already aborted", async () => {
    const api = createMockApi({ delayMs: 1000 });
    const controller = new AbortController();
    controller.abort();

    await expect(
      api.getEntities({
        actionId: "create-related-entity",
        signal: controller.signal,
      })
    ).rejects.toMatchObject({ name: "AbortError" });
  });
});
