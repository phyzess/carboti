export function createSmokePackageContext({ sourceTextUnder, text }) {
  const packageJson = JSON.parse(text("package.json"));
  const componentsConfig = JSON.parse(text("components.json"));
  const uiComponentsConfig = JSON.parse(text("packages/ui/components.json"));
  const appTemplateManifest = JSON.parse(text("templates/app/manifest.json"));
  const workspace = text("pnpm-workspace.yaml");
  const tsconfig = text("tsconfig.json");
  const baseTsconfig = text("tsconfig.base.json");
  const aiAdvisoryPackage = text("packages/ai-advisory/src/index.ts");
  const dbPackage = sourceTextUnder("packages/db/src");
  const importPipeline = sourceTextUnder("packages/import-pipeline/src");
  const chartsPackage = sourceTextUnder("packages/charts/src");
  const templateFeature = text("templates/feature/src/import-feature.ts");
  const templateFeatureRegistry = text("templates/feature/src/registry.ts");
  const templateFeatureFixtures = text("templates/feature/src/fixtures.ts");
  const templateFeatureWebSurface = text("templates/feature/src/web-surface.ts");
  const exampleImportReview = sourceTextUnder("examples/import-review/src");
  const exampleJsonRecords = sourceTextUnder("examples/json-records/src");
  const authPackage = sourceTextUnder("packages/auth/src");
  const emailPackage = sourceTextUnder("packages/email/src");
  const i18nPackage = sourceTextUnder("packages/i18n/src");
  const rbacPackage = sourceTextUnder("packages/rbac/src");
  const uiSources = sourceTextUnder("packages/ui/src");
  const envExample = text(".env.example");
  const uiPackage = JSON.parse(text("packages/ui/package.json"));
  const templateFeaturePackage = JSON.parse(text("templates/feature/package.json"));
  const designTokens = text("packages/design-system/src/tokens.css");
  const uiStyles = [
    text("packages/ui/src/styles.css"),
    text("packages/ui/src/styles/theme.css"),
    text("packages/ui/src/styles/shell-frame.css"),
    text("packages/ui/src/styles/data-tools.css"),
    text("packages/ui/src/styles/animated-icon.css"),
    text("packages/ui/src/styles/shell-controls.css"),
    text("packages/ui/src/styles/overlays.css"),
    text("packages/ui/src/styles/form-controls.css"),
    text("packages/ui/src/styles/upload-list.css"),
    text("packages/ui/src/styles/shared-controls.css"),
    text("packages/ui/src/styles/surfaces.css"),
    text("packages/ui/src/styles/responsive.css"),
  ].join("\n");
  const coreMigration = [
    text("apps/worker/migrations/0001_core.sql"),
    text("apps/worker/migrations/0002_intake_reliability.sql"),
    text("apps/worker/migrations/0003_review_commit.sql"),
    text("apps/worker/migrations/0004_auth_email.sql"),
    text("apps/worker/migrations/0005_ai_advisories.sql"),
    text("apps/worker/migrations/0006_user_roles.sql"),
    text("apps/worker/migrations/0007_event_foundations.sql"),
    text("apps/worker/migrations/0008_inbound_email.sql"),
    text("apps/worker/migrations/0009_carboti_contracts.sql"),
    text("apps/worker/migrations/0010_carboti_objects.sql"),
  ].join("\n");
  const legacyImportAdapterName = "Domain" + "ImportAdapter";

  return {
    aiAdvisoryPackage,
    appTemplateManifest,
    authPackage,
    baseTsconfig,
    chartsPackage,
    componentsConfig,
    coreMigration,
    dbPackage,
    designTokens,
    emailPackage,
    envExample,
    exampleImportReview,
    exampleJsonRecords,
    i18nPackage,
    importPipeline,
    legacyImportAdapterName,
    packageJson,
    rbacPackage,
    templateFeature,
    templateFeatureFixtures,
    templateFeaturePackage,
    templateFeatureRegistry,
    templateFeatureWebSurface,
    tsconfig,
    uiComponentsConfig,
    uiPackage,
    uiSources,
    uiStyles,
    workspace,
  };
}
