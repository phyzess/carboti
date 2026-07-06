export function assertWebMockApiInventoryGuards(context) {
  const { assert, exists } = context;

  assert(
    exists("apps/web/src/mock-api-invitation-model.ts") &&
      exists("apps/web/src/mock-api-identifiers.ts") &&
      exists("apps/web/src/mock-api-time.ts") &&
      exists("apps/web/src/mock-api-values.ts") &&
      exists("apps/web/src/mock-api-seed-graph.ts") &&
      exists("apps/web/src/mock-api-seed-invitations.ts") &&
      exists("apps/web/src/mock-api-seed-review.ts") &&
      exists("apps/web/src/mock-api-seed-audit.ts") &&
      exists("apps/web/src/mock-api-auth-operations.ts") &&
      exists("apps/web/src/mock-api-auth-routes.ts") &&
      exists("apps/web/src/mock-api-user-operations.ts") &&
      exists("apps/web/src/mock-api-workspace-routes.ts") &&
      exists("apps/web/src/mock-api-invitation-operations.ts") &&
      exists("apps/web/src/mock-api-invitation-routes.ts") &&
      exists("apps/web/src/mock-api-source-upload.ts") &&
      exists("apps/web/src/mock-api-advisory-operations.ts") &&
      exists("apps/web/src/mock-api-advisory-routes.ts") &&
      exists("apps/web/src/mock-api-import-job-operations.ts") &&
      exists("apps/web/src/mock-api-import-job-routes.ts") &&
      exists("apps/web/src/mock-api-import-review-routes.ts") &&
      exists("apps/web/src/mock-api-import-job-status.ts") &&
      exists("apps/web/src/mock-api-review-decision-operations.ts") &&
      exists("apps/web/src/mock-api-review-commit-operations.ts") &&
      exists("apps/web/src/mock-api-audit-filter.ts"),
    "apps/web mock API support modules must exist.",
  );
}
