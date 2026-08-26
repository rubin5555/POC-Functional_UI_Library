# Shared workflow state machine

This is the canonical behavior every implementation (Lit, Mithril, Stencil)
reproduces **independently**. Only the contract types, mock data, and API
interface are shared — never the controller or rendering code. Keeping this
document as the single reference is what makes the three implementations
functionally equivalent, and therefore comparable.

## States

| State        | Meaning                                                        |
| ------------ | ------------------------------------------------------------- |
| `idle`       | Mounted, nothing fetched yet.                                 |
| `loading`    | `getEntities` in flight.                                      |
| `ready`      | Entities loaded (possibly empty); user may select and submit. |
| `submitting` | `executeAction` in flight.                                    |
| `success`    | Action executed; result emitted to the host.                  |
| `error`      | The last `getEntities` or `executeAction` call failed.        |

## Transitions

```text
idle ──start──▶ loading
loading ──resolve(entities)──▶ ready
loading ──reject──▶ error
ready ──select(entityId)──▶ ready            (tracks selectedEntityId)
ready ──submit──▶ submitting                 (only when an entity is selected)
submitting ──resolve(result)──▶ success      (emit success result to host)
submitting ──reject──▶ error
error ──retry──▶ loading                     (re-runs the failed step)
success ──reset──▶ idle
error ──reset──▶ idle
any ──reset──▶ idle
```

## Required behaviors

Every implementation must provide, per the shared behavioral contract:

- a loading indicator while `loading` / `submitting`;
- an empty-result state when `ready` with zero entities;
- an API error state with a **retry** affordance;
- entity **selection**, with the selected entity visually obvious;
- **submit/confirm**, disabled while no entity is selected;
- the whole UI disabled while `submitting`;
- **success** feedback carrying the result;
- **reset** back to `idle`;
- **cleanup on unmount** — no timers, listeners, or callbacks left active;
- **abort** of any in-flight request on unmount/reset where the technology
  supports it (the mock honors `AbortSignal`).

## Result

On reaching `success`, the workflow emits a `FunctionalUIResult`
(`{ actionId, selectedEntityId, status: "success" }`) to the host — as a
`CustomEvent` (Lit, Stencil) or an `onSuccess` callback (Mithril), bridged to a
typed React `onSuccess` in every React wrapper.
