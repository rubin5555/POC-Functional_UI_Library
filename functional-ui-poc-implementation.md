# Functional UI Library POC — Lit vs Mithril vs Stencil

## 1. Goal

Build a proof-of-concept that implements the same functional UI workflow three times using:

1. Lit
2. Mithril.js
3. Stencil

All three implementations must live in the same repository and must be testable from one demo consumer application through separate routes.

The POC is intended to compare the three technologies for a future **functional UI library** that external systems will install and embed in their own applications.

This is not a visual component-library benchmark only. Each implementation must prove that it can:

- render reusable UI;
- own workflow/state logic;
- call backend APIs;
- expose a clean public package API;
- support framework-agnostic consumption where possible;
- provide framework-specific integrations;
- work inside a realistic consumer application;
- be independently bundled and imported;
- avoid bundling framework dependencies into the consumer unnecessarily;
- support future authentication/session handling through the browser.

The POC must keep the business behavior functionally equivalent across Lit, Mithril, and Stencil so that the comparison is meaningful.

---

## 2. Primary Architecture

Use a **pnpm workspace monorepo**.

Recommended structure:

```text
functional-ui-poc/
├─ apps/
│  └─ demo-consumer/
│     ├─ src/
│     │  ├─ app/
│     │  ├─ routes/
│     │  │  ├─ home/
│     │  │  ├─ lit/
│     │  │  ├─ mithril/
│     │  │  └─ stencil/
│     │  └─ main.tsx
│     ├─ package.json
│     └─ vite.config.ts
│
├─ packages/
│  ├─ shared-contract/
│  │  ├─ src/
│  │  │  ├─ types.ts
│  │  │  ├─ api.ts
│  │  │  └─ mock-data.ts
│  │  └─ package.json
│  │
│  ├─ lit-functional-ui/
│  │  ├─ src/
│  │  │  ├─ core/
│  │  │  ├─ components/
│  │  │  ├─ web-component/
│  │  │  ├─ react/
│  │  │  └─ index.ts
│  │  └─ package.json
│  │
│  ├─ mithril-functional-ui/
│  │  ├─ src/
│  │  │  ├─ core/
│  │  │  ├─ components/
│  │  │  ├─ mount/
│  │  │  ├─ react/
│  │  │  └─ index.ts
│  │  └─ package.json
│  │
│  └─ stencil-functional-ui/
│     ├─ src/
│     │  ├─ components/
│     │  ├─ services/
│     │  ├─ react/
│     │  └─ index.ts
│     ├─ stencil.config.ts
│     └─ package.json
│
├─ package.json
├─ pnpm-workspace.yaml
├─ tsconfig.base.json
└─ README.md
```

The exact folder names may vary, but the architecture must preserve the same conceptual boundaries.

---

## 3. Demo Consumer

Create one React + TypeScript + Vite consumer application.

The consumer represents an external product installing the future functional UI library.

Use React Router.

Required routes:

```text
/
 /lit
 /mithril
 /stencil
```

The root page should link to each POC.

Each technology route must show:

- technology name;
- the functional UI implementation;
- current integration mode;
- buttons or controls needed to execute the sample workflow;
- a small debug area showing emitted events and/or current result;
- a reset button.

The consumer must not reach into package internals.

It may only consume documented public exports from each package.

---

## 4. Functional Workflow to Implement

Implement the exact same workflow in all three packages.

Use a small but realistic workflow resembling the future product.

### Example workflow

A user opens an entity picker.

The library:

1. receives an `actionId`;
2. receives optional context from the host application;
3. calls an API to fetch available entities;
4. displays the entities;
5. allows one entity to be selected;
6. confirms the selection;
7. calls another API representing the action execution;
8. emits a success result back to the host application.

Example public input:

```ts
type FunctionalUIInput = {
  actionId: string;
  userId?: string;
  context?: {
    sourceEntityId?: string;
  };
};
```

Example entity:

```ts
type Entity = {
  id: string;
  name: string;
  type: string;
};
```

Example result:

```ts
type FunctionalUIResult = {
  actionId: string;
  selectedEntityId: string;
  status: "success";
};
```

The exact domain terminology is not important.

What matters is that the same state machine and API interaction exist in all three implementations.

---

## 5. Backend/API Layer

Do not require a real backend for the POC.

Create a shared API abstraction in `packages/shared-contract`.

Example:

```ts
export interface FunctionalUIApi {
  getEntities(input: {
    actionId: string;
    signal?: AbortSignal;
  }): Promise<Entity[]>;

  executeAction(input: {
    actionId: string;
    selectedEntityId: string;
    signal?: AbortSignal;
  }): Promise<FunctionalUIResult>;
}
```

Provide a mock implementation.

The mock API should:

- return deterministic data;
- introduce a small artificial delay;
- support loading states;
- optionally expose a way to simulate an error;
- honor `AbortSignal` where practical.

Each library implementation must receive or create this API through an explicit configuration mechanism.

Do not hard-code direct `fetch()` calls throughout UI components.

---

## 6. Shared Behavioral Contract

All three implementations must support the same states:

```text
idle
loading
ready
submitting
success
error
```

All three must support:

- loading indicator;
- empty result state;
- API error state;
- retry;
- entity selection;
- submit/confirm;
- disabled submit while no entity is selected;
- disabled UI while submitting;
- success feedback;
- reset;
- cleanup when unmounted;
- aborting in-flight requests where supported.

The visible behavior should be intentionally similar.

Do not spend significant time making the three implementations pixel-perfect.

The purpose is architectural comparison.

---

## 7. Public API

Each implementation must expose a clear package-level public API.

Do not require the consumer to import private source files.

Each package should expose at least:

```ts
export type {
  FunctionalUIInput,
  FunctionalUIResult,
  FunctionalUIApi
};
```

Each package should also expose the technology-specific integration.

---

# 8. Lit Implementation

Package:

```text
@functional-ui-poc/lit
```

Implement the functional UI as a Lit custom element.

Suggested element:

```html
<functional-action-lit></functional-action-lit>
```

The element should accept configuration through properties rather than serialized HTML attributes for complex values.

Example usage:

```ts
const element = document.createElement("functional-action-lit");

element.input = {
  actionId: "create-related-entity"
};

element.api = api;
```

Emit a browser custom event when the workflow succeeds.

Example:

```ts
element.addEventListener("functional-ui-success", event => {
  console.log(event.detail);
});
```

Use:

```ts
new CustomEvent("functional-ui-success", {
  detail: result,
  bubbles: true,
  composed: true
});
```

### Lit requirements

- use reactive Lit properties/state;
- isolate implementation details inside the component;
- support cleanup;
- use Shadow DOM unless there is a strong technical reason not to;
- keep API/state code separate from rendering when practical;
- expose a custom element registration entrypoint;
- make repeated registration safe.

Suggested exports:

```text
@functional-ui-poc/lit
@functional-ui-poc/lit/register
@functional-ui-poc/lit/react
```

---

# 9. Lit React Integration

Create a React wrapper.

The React consumer should not need to manually attach CustomEvent listeners.

Desired usage:

```tsx
import { LitFunctionalAction } from "@functional-ui-poc/lit/react";

<LitFunctionalAction
  input={{ actionId: "create-related-entity" }}
  api={api}
  onSuccess={(result) => {
    console.log(result);
  }}
/>
```

The wrapper must:

- properly assign object properties to the web component;
- bridge CustomEvents to typed React callbacks;
- forward `className` where reasonable;
- handle mount/unmount correctly;
- not duplicate the underlying workflow implementation.

The React wrapper should be thin.

---

# 10. Mithril Implementation

Package:

```text
@functional-ui-poc/mithril
```

The Mithril package should demonstrate whether Mithril can serve as an implementation technology while still exposing an integration surface that does not force the host application to become a Mithril application.

Create a programmatic mount API.

Desired low-level usage:

```ts
import { mountFunctionalAction } from "@functional-ui-poc/mithril";

const instance = mountFunctionalAction({
  target: HTMLElement,
  input: {
    actionId: "create-related-entity"
  },
  api,
  onSuccess(result) {
    console.log(result);
  }
});
```

The function must return an object that allows teardown:

```ts
instance.destroy();
```

Example interface:

```ts
type MithrilFunctionalUIInstance = {
  destroy(): void;
  update?(input: FunctionalUIInput): void;
};
```

### Mithril requirements

- mount into a caller-provided DOM node;
- do not assume ownership of the host application;
- cleanup completely on destroy;
- keep state isolated per mounted instance;
- avoid global mutable workflow state;
- expose callbacks instead of requiring the host to understand Mithril;
- ensure multiple instances can exist simultaneously.

---

# 11. Mithril React Integration

Create a thin React bridge.

Desired usage:

```tsx
import { MithrilFunctionalAction } from "@functional-ui-poc/mithril/react";

<MithrilFunctionalAction
  input={{ actionId: "create-related-entity" }}
  api={api}
  onSuccess={handleSuccess}
/>
```

The wrapper should:

1. create a `div` ref;
2. call `mountFunctionalAction()` after mount;
3. destroy the Mithril instance on unmount;
4. update or remount when relevant props change.

Prefer a clean `update()` path if it is simple.

Do not add complex synchronization only for the sake of the POC.

Document whether the wrapper updates or remounts.

---

# 12. Stencil Implementation

Package:

```text
@functional-ui-poc/stencil
```

Build the workflow as a Stencil web component.

Suggested element:

```html
<functional-action-stencil></functional-action-stencil>
```

Expose equivalent public properties and events to the Lit implementation.

Conceptual API:

```ts
@Prop() input: FunctionalUIInput;
@Prop() api: FunctionalUIApi;

@Event() functionalUiSuccess: EventEmitter<FunctionalUIResult>;
```

Naming may be adapted to Stencil conventions.

### Stencil requirements

- use typed props;
- use typed events;
- support Shadow DOM if practical;
- support async workflow state;
- clean up pending work;
- generate standard custom-elements output;
- keep business behavior equivalent to Lit and Mithril.

Suggested exports:

```text
@functional-ui-poc/stencil
@functional-ui-poc/stencil/loader
@functional-ui-poc/stencil/react
```

---

# 13. Stencil React Integration

Use Stencil's recommended React integration strategy if it fits the installed Stencil version.

The consumer-facing API should still look like:

```tsx
import { StencilFunctionalAction } from "@functional-ui-poc/stencil/react";

<StencilFunctionalAction
  input={{ actionId: "create-related-entity" }}
  api={api}
  onSuccess={handleSuccess}
/>
```

If Stencil generates wrappers, keep generated code separate from hand-written public exports.

The goal is to evaluate:

- wrapper ergonomics;
- generation complexity;
- package complexity;
- TypeScript quality;
- runtime behavior.

---

# 14. Route Requirements

## `/lit`

Render two sections if possible:

### Native custom element

Render the Lit web component directly from React.

This verifies the raw web-component boundary.

### React integration

Render the React wrapper.

This verifies framework ergonomics.

---

## `/mithril`

Render two sections:

### Programmatic mount

Use a React-owned DOM container and manually call the package mount API.

### React integration

Render the React wrapper.

---

## `/stencil`

Render two sections:

### Native custom element

Render the Stencil-generated custom element.

### React integration

Render the React wrapper/generated wrapper.

---

# 15. Package Exports

Configure real package exports rather than relying on TypeScript source imports.

Example:

```json
{
  "name": "@functional-ui-poc/lit",
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./react": {
      "types": "./dist/react/index.d.ts",
      "import": "./dist/react/index.js"
    },
    "./register": {
      "types": "./dist/register.d.ts",
      "import": "./dist/register.js"
    }
  }
}
```

Adapt as necessary for each technology.

Important:

The consumer must install/import package entrypoints exactly as a real external consumer would.

Do not use imports such as:

```ts
../../../packages/lit-functional-ui/src/...
```

---

# 16. Dependency Rules

The POC must make dependency behavior visible.

For each package, decide which dependencies are:

- `dependencies`;
- `peerDependencies`;
- `devDependencies`.

### React

React must be a peer dependency for React integrations.

Do not bundle another copy of React into the package.

Example:

```json
{
  "peerDependencies": {
    "react": ">=18",
    "react-dom": ">=18"
  }
}
```

### Lit

If Lit is required by the runtime implementation, document whether it is bundled into the package output or remains a runtime dependency.

### Mithril

Document whether Mithril is bundled or left as a package dependency.

The host application should not need to consciously use Mithril.

### Stencil

Document the runtime dependencies generated by Stencil.

One of the explicit outputs of the POC is understanding what the consumer actually downloads.

---

# 17. Styling

Use deliberately simple styling.

Requirements:

- layout must be readable;
- selected entity must be visually obvious;
- loading/error/success states must be obvious;
- components should not rely on global CSS from the demo application.

For web-component implementations, evaluate Shadow DOM style isolation.

For Mithril, use a scoped package stylesheet or another simple strategy.

Document the difference.

---

# 18. Authentication Preparation

Do not implement the full SSO solution in this POC unless it is trivial.

However, design the API boundary so authentication can be added without rewriting the UI.

Future intended model:

1. external host loads the functional UI library;
2. the library communicates with the functional UI backend;
3. browser-based SSO establishes a session with the functional UI backend;
4. later API calls use that authenticated browser session;
5. the backend authorizes the authenticated user.

Therefore:

- do not make `userId` the security boundary;
- do not treat caller-provided identity as trusted authentication;
- keep API calls centralized;
- make it possible to use `fetch(..., { credentials: "include" })` later;
- ensure API clients can be configured with a base URL;
- keep room for future auth/bootstrap logic.

Suggested future API configuration:

```ts
type FunctionalUIClientConfig = {
  baseUrl: string;
  credentials?: RequestCredentials;
};
```

For this POC, a mock API implementation is sufficient.

---

# 19. Host System Identification Preparation

The future architecture may identify the embedding system using browser origin plus a registered manifest/base URL.

Do not build authorization around this assumption yet.

For the POC, add a host context type:

```ts
type HostContext = {
  origin?: string;
  systemId?: string;
};
```

This may be passed into the functional UI configuration.

It should only be treated as context in the POC, not trusted authentication.

---

# 20. Testing

Add minimal automated tests.

Do not aim for exhaustive coverage.

Each implementation should have tests proving:

1. loading starts;
2. entities appear;
3. user can select an entity;
4. submit triggers the API;
5. success is emitted/called;
6. error is displayed;
7. teardown does not leave active workflow behavior behind.

Use the testing approach most natural to each technology.

Also add at least one demo-app integration smoke test if practical.

---

# 21. Comparison Instrumentation

The purpose of the POC is comparison, so collect objective information.

Add a root command:

```bash
pnpm compare
```

It should build all three packages and print or generate a simple comparison report.

Capture at least:

```text
Technology
Raw JS bundle size
Gzipped JS size
CSS size if applicable
Number of runtime dependencies
Number of generated files
Build duration
Type declaration availability
Web component support
React wrapper strategy
```

A Markdown report is sufficient.

Suggested output:

```text
comparison-results.md
```

Do not optimize prematurely.

Record the default build output first.

---

# 22. Developer Experience Comparison

Add a manually maintained section in `comparison-results.md` for qualitative observations.

Use these headings:

```text
## Lit

### Good
### Bad
### Surprising

## Mithril

### Good
### Bad
### Surprising

## Stencil

### Good
### Bad
### Surprising
```

Also compare:

- implementation complexity;
- framework integration complexity;
- package/build complexity;
- API ergonomics;
- custom element ergonomics;
- TypeScript quality;
- event handling;
- styling isolation;
- debugging experience;
- bundle cost;
- consumer setup;
- ability to hide implementation technology;
- suitability for a functional UI SDK rather than a normal design system.

---

# 23. Important POC Constraint

Do not create three different architectures.

Implement the same conceptual architecture three times.

Shared concepts:

```text
Input
  ↓
Workflow Controller
  ↓
API Client
  ↓
State
  ↓
UI
  ↓
Result Event / Callback
```

The syntax will differ by technology, but the responsibilities should remain comparable.

---

# 24. Avoid Overengineering

Do not add:

- Redux;
- Zustand;
- GraphQL;
- real authentication;
- a real backend;
- SSR;
- Next.js;
- advanced theming;
- complex design-system primitives;
- production observability;
- localization;
- plugin systems;
- microfrontend infrastructure.

The POC should isolate the decision:

> Which technology gives the best foundation for a framework-agnostic functional UI package that can still provide excellent framework-specific integrations?

---

# 25. Commands

The repository should support:

```bash
pnpm install
pnpm dev
pnpm build
pnpm test
pnpm compare
```

`pnpm dev` should start the demo consumer.

If packages need watch mode, configure the root command so a developer does not need to manually start several package processes.

---

# 26. Root README

Create a short README with:

- purpose of the POC;
- technologies being compared;
- install command;
- run command;
- route table;
- build command;
- test command;
- comparison command.

Route table:

| Route | Implementation |
|---|---|
| `/lit` | Lit |
| `/mithril` | Mithril |
| `/stencil` | Stencil |

---

# 27. Acceptance Criteria

The POC is complete when all of the following are true.

## Repository

- [ ] pnpm workspace is configured.
- [ ] one demo consumer application exists.
- [ ] Lit, Mithril, and Stencil exist as separate packages.
- [ ] all packages build independently.
- [ ] root build succeeds.

## Functional behavior

- [ ] all three implementations execute the same workflow.
- [ ] all three use the shared API contract.
- [ ] all three display equivalent loading/error/success states.
- [ ] all three emit the same conceptual result.

## Lit

- [ ] usable as a native custom element.
- [ ] usable through a React wrapper.
- [ ] cleanup works.

## Mithril

- [ ] usable through a framework-neutral mount function.
- [ ] returns a destroy handle.
- [ ] usable through a React wrapper.
- [ ] multiple instances can coexist.

## Stencil

- [ ] usable as a native custom element.
- [ ] usable through a React integration.
- [ ] generated loader/wrapper setup is documented.
- [ ] cleanup works.

## Consumer

- [ ] `/lit` works.
- [ ] `/mithril` works.
- [ ] `/stencil` works.
- [ ] consumer imports only public package exports.
- [ ] no consumer route imports package source files.

## Packaging

- [ ] package exports are configured.
- [ ] TypeScript declarations are generated.
- [ ] React is not duplicated in package bundles.
- [ ] runtime dependency behavior is documented.

## Comparison

- [ ] bundle sizes are recorded.
- [ ] dependency counts are recorded.
- [ ] build behavior is recorded.
- [ ] React integration ergonomics are documented.
- [ ] framework-neutral integration ergonomics are documented.
- [ ] qualitative pros/cons are documented.

---

# 28. Suggested Implementation Order

Implement in this order:

1. create pnpm workspace;
2. create shared contracts/API mock;
3. create demo React application and routes;
4. define the shared workflow behavior;
5. implement Lit native component;
6. integrate Lit directly in the consumer;
7. add Lit React wrapper;
8. implement Mithril mount API;
9. integrate Mithril manually;
10. add Mithril React wrapper;
11. implement Stencil component;
12. integrate Stencil custom element;
13. add/generate Stencil React integration;
14. add tests;
15. add package builds and exports;
16. add comparison tooling;
17. document findings.

Do not build all framework integrations first and test them at the end.

After each technology is implemented, make its demo route fully usable before proceeding.

---

# 29. Coding Agent Instructions

When implementing this POC:

- prefer boring, explicit code;
- keep technology-specific code inside its own package;
- do not abstract away differences that are specifically being evaluated;
- share contracts, mock data, and API types;
- do not share rendering/controller code between Lit, Mithril, and Stencil;
- keep all public APIs typed;
- keep React wrappers thin;
- document any place where the technology forces a materially different architecture;
- if a library's recommended integration differs from the desired API, use the recommended integration and document the difference rather than fighting the framework;
- prioritize a working comparison over production-hardening.

If a decision is ambiguous, choose the option that best answers the architectural comparison rather than the option that produces the least code.

---

# 30. Final Deliverable

At the end, the repository should let a developer run:

```bash
pnpm install
pnpm dev
```

and visit:

```text
http://localhost:5173/lit
http://localhost:5173/mithril
http://localhost:5173/stencil
```

Each route should demonstrate the same functional workflow through that technology.

The repository should also produce a comparison report explaining which solution appears strongest for the eventual production functional UI library and why.
