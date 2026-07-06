export function assertImportPipelineInterfaces({ assert, importPipeline }) {
  assert(
    importPipeline.createManualReviewIssue().code === "manual_review_required",
    "import-pipeline must create the default confirmation gate issue.",
  );
  assert(
    importPipeline.stagedRecordKeyForSourceRow({
      sourceFileId: "source-1",
      rowIndex: 3,
    }) === "source-file:source-1:row:3",
    "import-pipeline must own staged record key conventions.",
  );
  assert(
    importPipeline.summarizeReviewStatuses(["pending", "approved", "approved", "unknown"])
      .approved === 2,
    "import-pipeline must summarize known review statuses while ignoring unknown values.",
  );
  assert(
    importPipeline.jobStatusForReviewSummary({
      pending: 1,
      approved: 0,
      committed: 1,
    }) === "needs_review",
    "import-pipeline must keep partially committed jobs in review when pending records remain.",
  );
  assert(
    importPipeline.jobStatusForReviewSummary({
      pending: 0,
      approved: 1,
      committed: 1,
    }) === "approved",
    "import-pipeline must surface jobs with approved uncommitted records.",
  );
  assert(
    importPipeline.reviewActionForConfirmationAction("confirm") === "approve" &&
      importPipeline.reviewActionForConfirmationAction("exclude") === "reject" &&
      importPipeline.confirmationStatusForStagedStatus("approved") === "confirmed" &&
      importPipeline.confirmationStatusForStagedStatus("rejected") === "excluded",
    "import-pipeline must expose confirmation-language aliases over existing review actions.",
  );
}
