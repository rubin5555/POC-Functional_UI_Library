import { registerFunctionalActionLit } from "./register-element.js";

export { registerFunctionalActionLit };

// Importing this entrypoint (`@functional-ui-poc/lit/register`) registers the
// element as a side effect, the way an external consumer expects.
registerFunctionalActionLit();
