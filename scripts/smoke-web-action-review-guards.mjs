export function assertWebReviewActionWorkflowGuards(context) {
  const {
    assert,
    webAppControllerWorkspacePropSections,
    webAppControllerWorkspaceProps,
    webReviewActions,
    webReviewAdvisoryActions,
    webReviewCommitActions,
    webReviewDecisionActions,
    webReviewJobActions,
    webReviewRecordActions,
  } = context;

  assert(
    webAppControllerWorkspaceProps.includes("buildAuthenticatedWorkspaceReviewProps") &&
      webAppControllerWorkspacePropSections.includes("reviewActions.commitApproved") &&
      webReviewActions.includes("createReviewJobActions") &&
      webReviewActions.includes("createReviewRecordActions") &&
      webReviewActions.includes("createReviewAdvisoryActions") &&
      webReviewJobActions.includes("function createReviewJobActions") &&
      webReviewRecordActions.includes("function createReviewRecordActions") &&
      webReviewRecordActions.includes("createReviewDecisionActions") &&
      webReviewRecordActions.includes("createReviewCommitActions") &&
      webReviewDecisionActions.includes("function createReviewDecisionActions") &&
      webReviewCommitActions.includes("function createReviewCommitActions") &&
      webReviewAdvisoryActions.includes("function createReviewAdvisoryActions") &&
      !webReviewActions.includes("approveStagedRecord") &&
      !webReviewActions.includes("generateAiAdvisory") &&
      !webReviewActions.includes("drainLocalImportJobs") &&
      !webReviewRecordActions.includes("approveStagedRecord") &&
      !webReviewRecordActions.includes("commitImportJob") &&
      !webReviewRecordActions.includes("confirmPendingStagedRecords"),
    "web review action modules must stay split by job, record, decision, commit, and advisory actions.",
  );
}
