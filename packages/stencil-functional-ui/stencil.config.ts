import { Config } from "@stencil/core";
import { reactOutputTarget } from "@stencil/react-output-target";

export const config: Config = {
  namespace: "functional-ui-stencil",
  outputTargets: [
    {
      type: "dist",
      esmLoaderPath: "../loader",
    },
    {
      type: "dist-custom-elements",
      customElementsExportBehavior: "auto-define-custom-elements",
      externalRuntime: false,
      generateTypeDeclarations: true,
    },
    // Stencil's recommended React integration: generates React wrappers into
    // dist/react (kept separate from the hand-written package exports).
    reactOutputTarget({
      outDir: "src/react-lib/generated",
      esModules: true,
      stencilPackageName: "@functional-ui-poc/stencil",
    }),
  ],
  testing: {
    browserHeadless: "shell",
  },
};
