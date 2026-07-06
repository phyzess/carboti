export function createSmokeWebRuntimeContext({ sourceTextUnder, text }) {
  const webSources = sourceTextUnder("apps/web/src");
  const webAuthRoute = text("apps/web/src/auth-route.ts");
  const webApi = text("apps/web/src/api.ts");
  const webApiAuth = [
    text("apps/web/src/api-auth.ts"),
    text("apps/web/src/api-auth-health.ts"),
    text("apps/web/src/api-auth-invitation-accept.ts"),
    text("apps/web/src/api-auth-invitations.ts"),
    text("apps/web/src/api-auth-local-bootstrap.ts"),
    text("apps/web/src/api-auth-password-reset.ts"),
    text("apps/web/src/api-auth-session.ts"),
    text("apps/web/src/api-auth-types.ts"),
    text("apps/web/src/api-auth-users.ts"),
  ].join("\n");
  const webApiImports = [
    text("apps/web/src/api-imports.ts"),
    text("apps/web/src/api-imports-advisory.ts"),
    text("apps/web/src/api-imports-jobs.ts"),
    text("apps/web/src/api-imports-review.ts"),
    text("apps/web/src/api-imports-types.ts"),
  ].join("\n");
  const webApiClient = [
    text("apps/web/src/api-client.ts"),
    text("apps/web/src/api-client-errors.ts"),
  ].join("\n");
  const webApiSources = [
    webApi,
    webApiClient,
    webApiAuth,
    text("apps/web/src/api-sources.ts"),
    webApiImports,
    text("apps/web/src/api-audit.ts"),
  ].join("\n");
  const webAuditFilters = text("apps/web/src/audit-filters.ts");
  const webPermissions = text("apps/web/src/web-permissions.ts");
  const webTypes = [
    text("apps/web/src/types.ts"),
    text("apps/web/src/types-auth.ts"),
    text("apps/web/src/types-audit.ts"),
    text("apps/web/src/types-import.ts"),
    text("apps/web/src/types-review.ts"),
    text("apps/web/src/types-source.ts"),
  ].join("\n");
  const webUploadQueueState = text("apps/web/src/upload-queue-state.ts");
  const webViteConfig = text("apps/web/vite.config.ts");
  const webPackage = JSON.parse(text("apps/web/package.json"));
  const webStyles = [
    text("apps/web/src/styles.css"),
    text("apps/web/src/styles/auth-page.css"),
    text("apps/web/src/styles/auth-page-layout.css"),
    text("apps/web/src/styles/auth-page-card.css"),
    text("apps/web/src/styles/auth-page-responsive.css"),
  ].join("\n");

  return {
    webApi,
    webApiAuth,
    webApiClient,
    webApiImports,
    webApiSources,
    webAuditFilters,
    webAuthRoute,
    webPackage,
    webPermissions,
    webSources,
    webStyles,
    webTypes,
    webUploadQueueState,
    webViteConfig,
  };
}
