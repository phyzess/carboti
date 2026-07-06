export function assertKitTemplateGuards(context) {
  const {
    adoptAppScript,
    appTemplateManifest,
    assert,
    exists,
    templateFeature,
    templateFeatureFixtures,
    templateFeaturePackage,
    templateFeatureRegistry,
    templateFeatureWebSurface,
  } = context;

  assert(
    templateFeaturePackage.scripts.typecheck === "tsc --noEmit -p tsconfig.json" &&
      templateFeaturePackage.dependencies["@carboti/import-pipeline"] === "workspace:*",
    "templates/feature must be a typechecked workspace package depending on the import pipeline contract.",
  );
  assert(
    templateFeature.includes("ImportFeatureAdapter") &&
      templateFeature.includes("commitApproved") &&
      !templateFeature.includes("throw new Error"),
    "templates/feature adapter must be a runnable starter, not an unchecked placeholder.",
  );
  assert(
    templateFeatureRegistry.includes("featureImportAdapters") &&
      templateFeatureRegistry.includes("featureIntegrationFixtures") &&
      templateFeatureRegistry.includes("featureWebSurfaces") &&
      templateFeatureRegistry.includes("selectFeatureImportAdapter"),
    "templates/feature must include app-owned adapter, fixture, and web surface registries.",
  );
  assert(
    templateFeatureFixtures.includes("templateFeatureFixture") &&
      templateFeatureFixtures.includes("expectedStagedCount") &&
      templateFeatureWebSurface.includes("templateFeatureWebSurface") &&
      templateFeatureWebSurface.includes("i18nKeys") &&
      templateFeatureWebSurface.includes("smokePath"),
    "templates/feature must include integration fixture and web surface descriptors.",
  );
  assert(
    Array.isArray(appTemplateManifest.copy) &&
      appTemplateManifest.copy.includes("apps/web") &&
      appTemplateManifest.copy.includes("apps/worker") &&
      appTemplateManifest.copy.includes("packages/auth") &&
      appTemplateManifest.copy.includes("packages/i18n") &&
      appTemplateManifest.copy.includes("templates/feature") &&
      appTemplateManifest.copy.includes("scripts/i18n-check.mjs") &&
      appTemplateManifest.copy.includes(".env.example"),
    "app template manifest must list the reusable app, package, feature template, and env entrypoints.",
  );

  for (const path of appTemplateManifest.copy) {
    assert(exists(path), `app template manifest references missing path: ${path}`);
  }

  for (const path of appTemplateManifest.optionalExamples ?? []) {
    assert(exists(path), `app template optional example references missing path: ${path}`);
  }

  assert(
    appTemplateManifest.copy.includes("scripts/adopt-app.mjs") &&
      appTemplateManifest.adoptionCommands?.some((command) => command.includes("adopt:app")) &&
      appTemplateManifest.productBaselineCleanup?.includes("templates"),
    "app template manifest must include the adopt-app script, adoption commands, and product cleanup paths.",
  );
  assert(
    adoptAppScript.includes("Dry run only") &&
      adoptAppScript.includes("clean-product-baseline") &&
      adoptAppScript.includes("git remote set-url --push") &&
      adoptAppScript.includes("carboti_session") &&
      adoptAppScript.includes("carboti-worker") &&
      adoptAppScript.includes("qitu-template"),
    "adopt-app script must default to dry-run identity changes and remote safety guidance.",
  );
}
