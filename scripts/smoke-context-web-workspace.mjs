export function createSmokeWebWorkspaceContext({ text }) {
  const webAuditPage = text("apps/web/src/workspace-page-sections/audit-page.tsx");
  const webAuditPageFilters = text("apps/web/src/workspace-page-sections/audit-page-filters.tsx");
  const webAuditPageResults = text("apps/web/src/workspace-page-sections/audit-page-results.tsx");
  const webAuditPageDetails = text("apps/web/src/workspace-page-sections/audit-page-details.tsx");
  const webSourcesPage = text("apps/web/src/workspace-page-sections/sources-page.tsx");
  const webSourceSelection = text("apps/web/src/workspace-page-sections/use-source-selection.ts");
  const webSourceDetailsDrawer = text(
    "apps/web/src/workspace-page-sections/source-details-drawer.tsx",
  );
  const webSourceDetailsContent = text(
    "apps/web/src/workspace-page-sections/source-details-content.tsx",
  );
  const webSourceUploadPanel = text("apps/web/src/workspace-page-sections/source-upload-panel.tsx");
  const webSourceUploadActions = text(
    "apps/web/src/workspace-page-sections/source-upload-actions.tsx",
  );
  const webSourceUploadQueueItems = text(
    "apps/web/src/workspace-page-sections/source-upload-queue-items.ts",
  );
  const webSourceFilesPanel = text("apps/web/src/workspace-page-sections/source-files-panel.tsx");
  const webSourceBatchActions = text(
    "apps/web/src/workspace-page-sections/source-batch-actions.tsx",
  );
  const webSourceFileRow = text("apps/web/src/workspace-page-sections/source-file-row.tsx");
  const webInvitationListPanel = text(
    "apps/web/src/workspace-page-sections/invitation-list-panel.tsx",
  );
  const webInvitationRow = text("apps/web/src/workspace-page-sections/invitation-row.tsx");
  const webInvitationRowDetails = text(
    "apps/web/src/workspace-page-sections/invitation-row-details.tsx",
  );
  const webInvitationRowActions = text(
    "apps/web/src/workspace-page-sections/invitation-row-actions.tsx",
  );
  const webImportJobsPanel = text("apps/web/src/workspace-page-sections/import-jobs-panel.tsx");
  const webImportJobRow = text("apps/web/src/workspace-page-sections/import-job-row.tsx");
  const webImportDiagnosticsPanel = text(
    "apps/web/src/workspace-page-sections/import-diagnostics-panel.tsx",
  );
  const webImportDiagnosticsDetails = text(
    "apps/web/src/workspace-page-sections/import-diagnostics-details.tsx",
  );
  const webImportDiagnosticsRuntimeRows = text(
    "apps/web/src/workspace-page-sections/import-diagnostics-runtime-rows.tsx",
  );
  const webImportEventTimeline = text(
    "apps/web/src/workspace-page-sections/import-event-timeline.tsx",
  );
  const webImportRecoveryPanel = text(
    "apps/web/src/workspace-page-sections/import-recovery-panel.tsx",
  );
  const webPageSectionShared = text("apps/web/src/workspace-page-sections/shared.tsx");
  const webPageSectionUi = text("apps/web/src/workspace-page-sections/page-section-ui.tsx");
  const webImportPageHelpers = text("apps/web/src/workspace-page-sections/import-page-helpers.ts");
  const webAuditPageHelpers = text("apps/web/src/workspace-page-sections/audit-page-helpers.ts");
  const webOverviewPageHelpers = text(
    "apps/web/src/workspace-page-sections/overview-page-helpers.ts",
  );
  const webStatusTone = text("apps/web/src/workspace-page-sections/status-tone.ts");
  const workspaceHome = text("apps/web/src/workspace-home.tsx");

  return {
    webAuditPage,
    webAuditPageDetails,
    webAuditPageFilters,
    webAuditPageHelpers,
    webAuditPageResults,
    webImportDiagnosticsDetails,
    webImportDiagnosticsRuntimeRows,
    webImportDiagnosticsPanel,
    webImportEventTimeline,
    webImportJobRow,
    webImportJobsPanel,
    webImportPageHelpers,
    webImportRecoveryPanel,
    webInvitationListPanel,
    webInvitationRow,
    webInvitationRowActions,
    webInvitationRowDetails,
    webOverviewPageHelpers,
    webPageSectionShared,
    webPageSectionUi,
    webSourceDetailsContent,
    webSourceDetailsDrawer,
    webSourceFileRow,
    webSourceBatchActions,
    webSourceFilesPanel,
    webSourceSelection,
    webSourceUploadActions,
    webSourceUploadPanel,
    webSourceUploadQueueItems,
    webSourcesPage,
    webStatusTone,
    workspaceHome,
  };
}
