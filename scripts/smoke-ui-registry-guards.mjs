export function assertUiRegistryGuards(context) {
  const {
    assert,
    componentsConfig,
    exists,
    uiComponentProvenanceDoc,
    uiComponentsConfig,
    uiPackage,
    uiSources,
    webSources,
  } = context;

  assert(
    exists("components.json") &&
      componentsConfig.style === "base-nova" &&
      componentsConfig.rsc === false &&
      componentsConfig.tsx === true &&
      componentsConfig.tailwind?.css === "packages/ui/src/styles.css" &&
      componentsConfig.aliases?.ui === "@/components",
    "components.json must configure shadcn base-nova output into packages/ui.",
  );
  assert(
    exists("packages/ui/components.json") &&
      uiComponentsConfig.style === "base-nova" &&
      uiComponentsConfig.rsc === false &&
      uiComponentsConfig.tsx === true &&
      uiComponentsConfig.tailwind?.css === "src/styles.css" &&
      uiComponentsConfig.aliases?.ui === "@/components",
    "packages/ui/components.json must be the executable shadcn install target.",
  );
  assert(
    uiPackage.dependencies["@base-ui/react"] === "1.6.0" &&
      uiPackage.dependencies.cmdk === "1.1.1" &&
      uiPackage.dependencies["date-fns"] === "4.4.0" &&
      uiPackage.dependencies["react-day-picker"] === "10.0.1" &&
      uiPackage.dependencies.vaul === "1.1.2" &&
      !("@base-ui-components/react" in uiPackage.dependencies),
    "@carboti/ui must use exact shadcn registry dependencies, not the old @base-ui-components RC package.",
  );
  assert(
    uiSources.includes("@base-ui/react/button") &&
      uiSources.includes("@base-ui/react/dialog") &&
      uiSources.includes("@base-ui/react/menu") &&
      uiSources.includes("@base-ui/react/field") &&
      uiSources.includes("@base-ui/react/input") &&
      uiSources.includes("@base-ui/react/select") &&
      uiSources.includes("@base-ui/react/checkbox") &&
      uiSources.includes("@base-ui/react/popover") &&
      uiSources.includes("react-day-picker") &&
      uiSources.includes("cmdk") &&
      uiSources.includes("vaul"),
    "@carboti/ui primitives must be backed by installed shadcn registry dependencies.",
  );
  assert(
    uiComponentProvenanceDoc.includes("UI Component Provenance") &&
      uiComponentProvenanceDoc.includes("packages/ui/components.json") &&
      uiComponentProvenanceDoc.includes("@base-ui/react") &&
      uiComponentProvenanceDoc.includes("DateField") &&
      uiComponentProvenanceDoc.includes("TableScrollArea") &&
      uiComponentProvenanceDoc.includes("App pages consume `@carboti/ui`"),
    "UI component provenance docs must record primitive sources, Base UI import boundaries, and maintenance rules.",
  );
  assert(
    !uiSources.includes("@base-ui-components/react") &&
      !webSources.includes("@base-ui-components/react"),
    "the old @base-ui-components/react package must not reappear in source.",
  );
}
