export function assertWebPageSharedGuards(context) {
  const {
    assert,
    webAuditPageDetails,
    webAuditPageHelpers,
    webAuditPageResults,
    webImportDiagnosticsDetails,
    webImportEventTimeline,
    webImportJobRow,
    webImportJobsPanel,
    webImportPageHelpers,
    webImportRecoveryPanel,
    webInvitationRowActions,
    webOverviewPageHelpers,
    webPageSectionShared,
    webPageSectionUi,
    webSourceDetailsContent,
    webSourceFileRow,
    webSourceUploadPanel,
    webSourcesPage,
    webStatusTone,
  } = context;

  assert(
    webPageSectionShared.includes("page-section-ui") &&
      webPageSectionShared.includes("import-page-helpers") &&
      webPageSectionShared.includes("audit-page-helpers") &&
      webPageSectionShared.includes("overview-page-helpers") &&
      webPageSectionShared.includes("status-tone") &&
      !webPageSectionShared.includes("function WorkflowTarget") &&
      !webPageSectionShared.includes("function importRecoveryGuidance") &&
      !webPageSectionShared.includes("function statusTone") &&
      webPageSectionUi.includes("function WorkflowTarget") &&
      webPageSectionUi.includes("function Guardrail") &&
      webPageSectionUi.includes("function PermissionHint") &&
      webImportPageHelpers.includes("function importJobTimelineItem") &&
      webImportPageHelpers.includes("function importRecoveryGuidance") &&
      webAuditPageHelpers.includes("function actorLabel") &&
      webAuditPageHelpers.includes("function auditStatusTone") &&
      webOverviewPageHelpers.includes("function latestTime") &&
      webStatusTone.includes("function statusTone") &&
      webAuditPageResults.includes("audit-page-helpers") &&
      webAuditPageDetails.includes("audit-page-helpers") &&
      !webImportDiagnosticsDetails.includes("import-page-helpers") &&
      webImportEventTimeline.includes("import-page-helpers") &&
      webImportRecoveryPanel.includes("import-page-helpers") &&
      webSourcesPage.includes("page-section-ui") &&
      webSourceUploadPanel.includes("page-section-ui") &&
      webImportJobsPanel.includes("page-section-ui") &&
      webSourceFileRow.includes("status-tone") &&
      webSourceDetailsContent.includes("status-tone") &&
      webInvitationRowActions.includes("status-tone") &&
      webImportJobRow.includes("status-tone"),
    "page-section shared exports must re-export focused UI, helper, and status-tone modules.",
  );
}
