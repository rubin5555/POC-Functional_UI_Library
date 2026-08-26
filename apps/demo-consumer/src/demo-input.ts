import type { FunctionalUIInput } from "@functional-ui-poc/shared-contract";

/**
 * The sample workflow input every route feeds into its implementation, so the
 * three technologies run the identical workflow and stay comparable.
 */
export const DEMO_INPUT: FunctionalUIInput = {
  actionId: "create-related-entity",
  context: {
    sourceEntityId: "acct-001",
  },
};
