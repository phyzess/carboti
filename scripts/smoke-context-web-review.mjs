export function createSmokeWebReviewContext({ text }) {
  const webReviewActions = text("apps/web/src/use-review-actions.ts");
  const webReviewJobActions = text("apps/web/src/review-job-actions.ts");
  const webReviewRecordActions = text("apps/web/src/review-record-actions.ts");
  const webReviewDecisionActions = text("apps/web/src/review-record-decision-actions.ts");
  const webReviewCommitActions = text("apps/web/src/review-commit-actions.ts");
  const webReviewAdvisoryActions = text("apps/web/src/review-advisory-actions.ts");
  const webReviewWorkspaceRoute = text("apps/web/src/review-workspace-route.tsx");
  const webReviewWorkspaceRouteProps = text("apps/web/src/review-workspace-route-props.ts");
  const webReviewConsole = text("apps/web/src/review-console.tsx");
  const webReviewConsoleTypes = text("apps/web/src/review-console-types.ts");
  const webReviewConsoleWorkflowColumn = text("apps/web/src/review-console-workflow-column.tsx");
  const webReviewConsoleSidebar = text("apps/web/src/review-console-sidebar.tsx");
  const webReviewConsoleAdvisoryPanel = text("apps/web/src/review-console-advisory-panel.tsx");
  const webReviewConsoleGuardrailsPanel = text("apps/web/src/review-console-guardrails-panel.tsx");
  const webReviewConsoleTimelinePanels = text("apps/web/src/review-console-timeline-panels.tsx");
  const webReviewConsoleSummaryPanel = text("apps/web/src/review-console-summary-panel.tsx");
  const webReviewConsoleSourcePanel = text("apps/web/src/review-console-source-panel.tsx");
  const webReviewConsoleUploadQueue = text("apps/web/src/review-console-upload-queue.tsx");
  const webReviewConsoleSourceList = text("apps/web/src/review-console-source-list.tsx");
  const webReviewConsoleImportJobsPanel = text("apps/web/src/review-console-import-jobs-panel.tsx");
  const webReviewConsoleParts = text("apps/web/src/review-console-parts.tsx");
  const webReviewConsoleHelpers = text("apps/web/src/review-console-helpers.ts");
  const webReviewConsoleAdvisoryItem = text("apps/web/src/review-console-advisory-item.tsx");
  const webReviewRecordsPanel = text("apps/web/src/review-records-panel.tsx");
  const webReviewRecordsTable = text("apps/web/src/review-records-table.tsx");
  const webReviewRecordRow = text("apps/web/src/review-record-row.tsx");
  const webReviewRecordsEmptyState = text("apps/web/src/review-records-empty-state.tsx");

  return {
    webReviewActions,
    webReviewAdvisoryActions,
    webReviewCommitActions,
    webReviewConsole,
    webReviewConsoleAdvisoryItem,
    webReviewConsoleHelpers,
    webReviewConsoleImportJobsPanel,
    webReviewConsoleParts,
    webReviewConsoleTypes,
    webReviewConsoleAdvisoryPanel,
    webReviewConsoleGuardrailsPanel,
    webReviewConsoleSidebar,
    webReviewConsoleSourceList,
    webReviewConsoleSourcePanel,
    webReviewConsoleSummaryPanel,
    webReviewConsoleTimelinePanels,
    webReviewConsoleUploadQueue,
    webReviewConsoleWorkflowColumn,
    webReviewDecisionActions,
    webReviewJobActions,
    webReviewRecordRow,
    webReviewRecordsEmptyState,
    webReviewRecordsPanel,
    webReviewRecordsTable,
    webReviewRecordActions,
    webReviewWorkspaceRoute,
    webReviewWorkspaceRouteProps,
  };
}
