export function assertWebReviewConsoleGuards(context) {
  const {
    assert,
    webReviewConsoleAdvisoryPanel,
    webReviewConsoleAdvisoryItem,
    webReviewConsoleGuardrailsPanel,
    webReviewConsoleHelpers,
    webReviewConsoleImportJobsPanel,
    webReviewConsoleParts,
    webReviewConsoleSidebar,
    webReviewConsoleSourceList,
    webReviewConsoleSourcePanel,
    webReviewConsoleSummaryPanel,
    webReviewConsoleTimelinePanels,
    webReviewConsole,
    webReviewConsoleTypes,
    webReviewConsoleUploadQueue,
    webReviewConsoleWorkflowColumn,
    webReviewRecordRow,
    webReviewRecordsEmptyState,
    webReviewRecordsPanel,
    webReviewRecordsTable,
    webReviewWorkspaceRoute,
    webReviewWorkspaceRouteProps,
  } = context;

  assert(
    webReviewConsole.includes("props: ReviewConsoleProps") &&
      !webReviewConsole.includes("type ReviewConsoleProps =") &&
      webReviewConsoleTypes.includes("export type ReviewConsoleProps") &&
      webReviewConsoleTypes.includes("export type ReviewCounts") &&
      webReviewWorkspaceRoute.includes("buildReviewConsoleProps") &&
      !webReviewWorkspaceRoute.includes("aiAdvisories={review.aiAdvisories}") &&
      !webReviewWorkspaceRoute.includes("navigation={shell.navigationModel.primaryNavigation}") &&
      webReviewWorkspaceRouteProps.includes("function buildReviewConsoleProps") &&
      webReviewWorkspaceRouteProps.includes("ReviewConsoleProps") &&
      webReviewWorkspaceRouteProps.includes("review.aiAdvisories") &&
      webReviewWorkspaceRouteProps.includes("shell.navigationModel.primaryNavigation") &&
      webReviewConsoleWorkflowColumn.includes("ReviewConsoleSummaryPanel") &&
      webReviewConsoleWorkflowColumn.includes("ReviewConsoleSourcePanel") &&
      webReviewConsoleWorkflowColumn.includes("ReviewConsoleImportJobsPanel") &&
      webReviewConsoleSummaryPanel.includes("function ReviewConsoleSummaryPanel") &&
      webReviewConsoleSourcePanel.includes("function ReviewConsoleSourcePanel") &&
      webReviewConsoleSourcePanel.includes("ReviewConsoleUploadQueue") &&
      webReviewConsoleSourcePanel.includes("ReviewConsoleSourceList") &&
      webReviewConsoleUploadQueue.includes("function ReviewConsoleUploadQueue") &&
      webReviewConsoleSourceList.includes("function ReviewConsoleSourceList") &&
      webReviewConsoleImportJobsPanel.includes("function ReviewConsoleImportJobsPanel") &&
      !webReviewConsoleWorkflowColumn.includes("<UploadQueue") &&
      !webReviewConsoleWorkflowColumn.includes("TimeSeriesChart") &&
      !webReviewConsoleWorkflowColumn.includes("JobStep") &&
      !webReviewConsoleSourcePanel.includes("<UploadQueue") &&
      !webReviewConsoleSourcePanel.includes("SourceFileItem") &&
      webReviewConsoleHelpers.includes("function uploadQueueItems") &&
      webReviewConsoleHelpers.includes("function timelineTone") &&
      webReviewConsoleAdvisoryItem.includes("function AiAdvisoryItem") &&
      webReviewConsoleSidebar.includes("function ReviewConsoleSidebar") &&
      webReviewConsoleSidebar.includes("ReviewConsoleGuardrailsPanel") &&
      webReviewConsoleSidebar.includes("ReviewConsoleAdvisoryPanel") &&
      webReviewConsoleSidebar.includes("ReviewImportTimelinePanel") &&
      webReviewConsoleSidebar.includes("ReviewAuditTimelinePanel") &&
      !webReviewConsoleSidebar.includes("TimelineItem") &&
      !webReviewConsoleSidebar.includes("AiAdvisoryItem") &&
      !webReviewConsoleSidebar.includes("timelineTone") &&
      webReviewConsoleGuardrailsPanel.includes("function ReviewConsoleGuardrailsPanel") &&
      webReviewConsoleGuardrailsPanel.includes("Guardrail") &&
      webReviewConsoleAdvisoryPanel.includes("function ReviewConsoleAdvisoryPanel") &&
      webReviewConsoleAdvisoryPanel.includes("AiAdvisoryItem") &&
      webReviewConsoleAdvisoryPanel.includes("PermissionHint") &&
      webReviewConsoleTimelinePanels.includes("function ReviewImportTimelinePanel") &&
      webReviewConsoleTimelinePanels.includes("function ReviewAuditTimelinePanel") &&
      webReviewConsoleTimelinePanels.includes("timelineTone") &&
      webReviewConsoleTimelinePanels.includes("TimelineItem") &&
      webReviewRecordsPanel.includes("ReviewRecordsTable") &&
      !webReviewRecordsPanel.includes("TableHeader") &&
      !webReviewRecordsPanel.includes("ReviewRecordRow") &&
      webReviewRecordsTable.includes("function ReviewRecordsTable") &&
      webReviewRecordsTable.includes("ReviewRecordRow") &&
      webReviewRecordsTable.includes("ReviewRecordsEmptyState") &&
      webReviewRecordsTable.includes("issueForRecord") &&
      webReviewRecordsTable.includes("TableHeader") &&
      !webReviewRecordsTable.includes("DataState") &&
      webReviewRecordRow.includes("function ReviewRecordRow") &&
      webReviewRecordRow.includes("payloadSummary") &&
      webReviewRecordRow.includes("statusTone") &&
      webReviewRecordsEmptyState.includes("function ReviewRecordsEmptyState") &&
      webReviewRecordsEmptyState.includes("DataState") &&
      !webReviewConsoleParts.includes("function uploadQueueItems") &&
      !webReviewConsoleParts.includes("function timelineTone") &&
      !webReviewConsoleParts.includes("function AiAdvisoryItem") &&
      !webReviewConsoleParts.includes("function ReviewRecordRow"),
    "review console panels, helpers, and advisory items must stay split.",
  );
}
