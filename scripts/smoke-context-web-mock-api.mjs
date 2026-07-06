export function createSmokeWebMockApiContext({ text }) {
  const webMockApiModel = text("apps/web/src/mock-api-model.ts");
  const webMockApiContentRecords = text("apps/web/src/mock-api-content-records.ts");
  const webMockApiEntityModel = text("apps/web/src/mock-api-entity-model.ts");
  const webMockApiEventModel = text("apps/web/src/mock-api-event-model.ts");
  const webMockApiInvitationModel = text("apps/web/src/mock-api-invitation-model.ts");
  const webMockApiIdentifiers = text("apps/web/src/mock-api-identifiers.ts");
  const webMockApiTime = text("apps/web/src/mock-api-time.ts");
  const webMockApiValues = text("apps/web/src/mock-api-values.ts");
  const webMockApiSupport = text("apps/web/src/mock-api-support.ts");
  const webMockApiSeedState = text("apps/web/src/mock-api-seed-state.ts");
  const webMockApiSeedGraph = text("apps/web/src/mock-api-seed-graph.ts");
  const webMockApiSeedInvitations = text("apps/web/src/mock-api-seed-invitations.ts");
  const webMockApiSeedReview = text("apps/web/src/mock-api-seed-review.ts");
  const webMockApiSeedAudit = text("apps/web/src/mock-api-seed-audit.ts");
  const webMockApiOperations = text("apps/web/src/mock-api-operations.ts");
  const webMockApiAuthOperations = text("apps/web/src/mock-api-auth-operations.ts");
  const webMockApiAuthRoutes = text("apps/web/src/mock-api-auth-routes.ts");
  const webMockApiInvitationOperations = text("apps/web/src/mock-api-invitation-operations.ts");
  const webMockApiInvitationRoutes = text("apps/web/src/mock-api-invitation-routes.ts");
  const webMockApiSourceUpload = text("apps/web/src/mock-api-source-upload.ts");
  const webMockApiUserOperations = text("apps/web/src/mock-api-user-operations.ts");
  const webMockApiWorkspaceRoutes = text("apps/web/src/mock-api-workspace-routes.ts");
  const webMockApiAdvisoryOperations = text("apps/web/src/mock-api-advisory-operations.ts");
  const webMockApiImportJobOperations = text("apps/web/src/mock-api-import-job-operations.ts");
  const webMockApiImportJobStatus = text("apps/web/src/mock-api-import-job-status.ts");
  const webMockApiImportRouteFacade = text("apps/web/src/mock-api-import-routes.ts");
  const webMockApiImportJobRoutes = text("apps/web/src/mock-api-import-job-routes.ts");
  const webMockApiImportReviewRoutes = text("apps/web/src/mock-api-import-review-routes.ts");
  const webMockApiReviewOperationsFacade = text("apps/web/src/mock-api-review-operations.ts");
  const webMockApiReviewDecisionOperations = text(
    "apps/web/src/mock-api-review-decision-operations.ts",
  );
  const webMockApiReviewCommitOperations = text(
    "apps/web/src/mock-api-review-commit-operations.ts",
  );
  const webMockApiImportRoutes = [
    webMockApiImportRouteFacade,
    webMockApiImportJobRoutes,
    webMockApiImportReviewRoutes,
  ].join("\n");
  const webMockApiAdvisoryRoutes = text("apps/web/src/mock-api-advisory-routes.ts");
  const webMockApiAuditFilter = text("apps/web/src/mock-api-audit-filter.ts");

  return {
    webMockApiAdvisoryOperations,
    webMockApiAdvisoryRoutes,
    webMockApiAuditFilter,
    webMockApiContentRecords,
    webMockApiEntityModel,
    webMockApiEventModel,
    webMockApiAuthOperations,
    webMockApiAuthRoutes,
    webMockApiIdentifiers,
    webMockApiImportJobOperations,
    webMockApiImportJobStatus,
    webMockApiImportJobRoutes,
    webMockApiImportReviewRoutes,
    webMockApiImportRouteFacade,
    webMockApiImportRoutes,
    webMockApiInvitationModel,
    webMockApiInvitationOperations,
    webMockApiInvitationRoutes,
    webMockApiModel,
    webMockApiOperations,
    webMockApiReviewCommitOperations,
    webMockApiReviewDecisionOperations,
    webMockApiReviewOperationsFacade,
    webMockApiSeedAudit,
    webMockApiSeedGraph,
    webMockApiSeedInvitations,
    webMockApiSeedReview,
    webMockApiSeedState,
    webMockApiSourceUpload,
    webMockApiSupport,
    webMockApiTime,
    webMockApiUserOperations,
    webMockApiValues,
    webMockApiWorkspaceRoutes,
  };
}
