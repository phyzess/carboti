export function assertWebMockApiOperationGuards(context) {
  const {
    assert,
    webMockApiAdvisoryOperations,
    webMockApiAdvisoryRoutes,
    webMockApiAuditFilter,
    webMockApiAuthOperations,
    webMockApiAuthRoutes,
    webMockApiImportJobOperations,
    webMockApiImportJobRoutes,
    webMockApiImportReviewRoutes,
    webMockApiImportRouteFacade,
    webMockApiImportRoutes,
    webMockApiInvitationOperations,
    webMockApiInvitationRoutes,
    webMockApiOperations,
    webMockApiReviewCommitOperations,
    webMockApiReviewDecisionOperations,
    webMockApiReviewOperationsFacade,
    webMockApiImportJobStatus,
    webMockApiSourceUpload,
    webMockApiSupport,
    webMockApiUserOperations,
    webMockApiWorkspaceRoutes,
  } = context;

  assert(
    webMockApiOperations.includes("mock-api-auth-operations") &&
      webMockApiOperations.includes("mock-api-source-upload") &&
      !webMockApiOperations.includes("function bootstrapDemoUser") &&
      !webMockApiOperations.includes("function uploadSourceFile") &&
      !webMockApiOperations.includes("function createAdvisory") &&
      !webMockApiOperations.includes("function filterAuditEvents") &&
      webMockApiAuthOperations.includes("function bootstrapDemoUser") &&
      webMockApiAuthOperations.includes("function loginDemoUser") &&
      webMockApiAuthOperations.includes("function requestDemoPasswordReset") &&
      webMockApiAuthRoutes.includes("loginDemoUser") &&
      webMockApiAuthRoutes.includes("requestDemoPasswordReset") &&
      !webMockApiAuthRoutes.includes("pushAudit") &&
      !webMockApiAuthRoutes.includes("findOrCreateDemoUser") &&
      webMockApiInvitationOperations.includes("function createInvitationForState") &&
      webMockApiInvitationOperations.includes("function acceptInvitationForState") &&
      webMockApiInvitationOperations.includes("function revokeInvitationForState") &&
      webMockApiInvitationRoutes.includes("acceptInvitationForState") &&
      webMockApiInvitationRoutes.includes("resendInvitationForState") &&
      !webMockApiInvitationRoutes.includes("pushAudit") &&
      !webMockApiInvitationRoutes.includes("findOrCreateDemoUser") &&
      webMockApiUserOperations.includes("function deleteUserForState") &&
      webMockApiUserOperations.includes("user.deleted") &&
      webMockApiSourceUpload.includes("function uploadSourceFile") &&
      webMockApiSourceUpload.includes("function uploadSourceFileForState") &&
      webMockApiSourceUpload.includes("writeState") &&
      webMockApiWorkspaceRoutes.includes("function handleMockWorkspaceRoute") &&
      webMockApiWorkspaceRoutes.includes("deleteUserForState") &&
      webMockApiWorkspaceRoutes.includes("uploadSourceFileForState") &&
      !webMockApiWorkspaceRoutes.includes("pushAudit") &&
      !webMockApiWorkspaceRoutes.includes("writeState") &&
      webMockApiAdvisoryOperations.includes("function createAdvisory") &&
      webMockApiAdvisoryOperations.includes("function generateAdvisoryForState") &&
      webMockApiAdvisoryOperations.includes("function confirmAdvisoryForState") &&
      webMockApiAdvisoryOperations.includes("function dismissAdvisoryForState") &&
      webMockApiAdvisoryOperations.includes("ai_advisory.confirmed") &&
      webMockApiAdvisoryOperations.includes("ai_advisory.dismissed") &&
      webMockApiImportRouteFacade.includes("handleMockImportJobRoute") &&
      webMockApiImportRouteFacade.includes("handleMockImportReviewRoute") &&
      webMockApiImportRouteFacade.includes("handleMockAdvisoryRoute") &&
      !webMockApiImportRouteFacade.includes("Demo retry prepared records") &&
      !webMockApiImportRouteFacade.includes("confirmPendingRecords") &&
      !webMockApiImportRouteFacade.includes("function handleMockAdvisoryRoute") &&
      !webMockApiImportRouteFacade.includes("ai_advisory.confirmed") &&
      webMockApiImportJobRoutes.includes("function handleMockImportJobRoute") &&
      webMockApiImportJobRoutes.includes("/api/dev/import-jobs/drain") &&
      webMockApiImportJobRoutes.includes("drainQueuedImportJobs") &&
      webMockApiImportJobRoutes.includes("commitImportJobForState") &&
      webMockApiImportJobRoutes.includes("retryImportJobForState") &&
      !webMockApiImportJobRoutes.includes("Demo retry prepared records") &&
      !webMockApiImportJobRoutes.includes("import_job.retried") &&
      !webMockApiImportJobRoutes.includes("pushAudit") &&
      !webMockApiImportJobRoutes.includes("writeState") &&
      webMockApiImportJobOperations.includes("function drainQueuedImportJobs") &&
      webMockApiImportJobOperations.includes("function commitImportJobForState") &&
      webMockApiImportJobOperations.includes("function retryImportJobForState") &&
      webMockApiImportJobOperations.includes("import_job.retried") &&
      webMockApiImportReviewRoutes.includes("function handleMockImportReviewRoute") &&
      webMockApiImportReviewRoutes.includes("confirmPendingRecordsForState") &&
      webMockApiImportReviewRoutes.includes("decideRecordForState") &&
      !webMockApiImportReviewRoutes.includes("writeState") &&
      webMockApiReviewOperationsFacade.includes("mock-api-review-decision-operations") &&
      webMockApiReviewOperationsFacade.includes("mock-api-review-commit-operations") &&
      webMockApiReviewOperationsFacade.includes("mock-api-import-job-status") &&
      !webMockApiReviewOperationsFacade.includes("function commitJob") &&
      !webMockApiReviewOperationsFacade.includes("function decideRecord") &&
      webMockApiReviewDecisionOperations.includes("function confirmPendingRecordsForState") &&
      webMockApiReviewDecisionOperations.includes("function confirmPendingRecords") &&
      webMockApiReviewDecisionOperations.includes("function decideRecordForState") &&
      webMockApiReviewDecisionOperations.includes("function decideRecord") &&
      webMockApiReviewDecisionOperations.includes("import_review.records_approved") &&
      webMockApiReviewCommitOperations.includes("function commitJob") &&
      webMockApiReviewCommitOperations.includes("import_job.committed") &&
      webMockApiImportJobStatus.includes("function recalculateJobStatus") &&
      webMockApiImportJobStatus.includes("function updateJobStatus") &&
      webMockApiImportRoutes.includes("handleMockAdvisoryRoute") &&
      webMockApiAdvisoryRoutes.includes("function handleMockAdvisoryRoute") &&
      webMockApiAdvisoryRoutes.includes("confirmAdvisoryForState") &&
      webMockApiAdvisoryRoutes.includes("dismissAdvisoryForState") &&
      !webMockApiAdvisoryRoutes.includes("pushAudit") &&
      !webMockApiAdvisoryRoutes.includes("pushJobEvent") &&
      !webMockApiAdvisoryRoutes.includes("writeState") &&
      webMockApiAuditFilter.includes("function filterAuditEvents") &&
      webMockApiSupport.includes("mock-api-auth-operations") &&
      webMockApiSupport.includes("mock-api-invitation-operations") &&
      webMockApiSupport.includes("mock-api-source-upload") &&
      webMockApiSupport.includes("mock-api-user-operations") &&
      webMockApiSupport.includes("mock-api-advisory-operations") &&
      webMockApiSupport.includes("mock-api-import-job-operations") &&
      webMockApiSupport.includes("mock-api-audit-filter"),
    "mock API auth, invitation, user, upload, advisory, route, and audit operations must stay split.",
  );
}
