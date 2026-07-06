export function assertWebImportPageGuards(context) {
  const {
    assert,
    webImportDiagnosticsDetails,
    webImportDiagnosticsPanel,
    webImportDiagnosticsRuntimeRows,
    webImportEventTimeline,
    webImportJobRow,
    webImportJobsPanel,
    webImportRecoveryPanel,
    webInvitationListPanel,
    webInvitationRow,
    webInvitationRowActions,
    webInvitationRowDetails,
  } = context;

  assert(
    webInvitationListPanel.includes("InvitationRow") &&
      !webInvitationListPanel.includes("function InvitationRow") &&
      webInvitationRow.includes("function InvitationRow") &&
      webInvitationRow.includes("InvitationRowDetails") &&
      webInvitationRow.includes("InvitationRowActions") &&
      !webInvitationRow.includes("latestEmailErrorMessage") &&
      !webInvitationRow.includes("<Send") &&
      webInvitationRowDetails.includes("function InvitationRowDetails") &&
      webInvitationRowDetails.includes("latestEmailErrorMessage") &&
      webInvitationRowDetails.includes("invitation.latestEmail") &&
      webInvitationRowActions.includes("function InvitationRowActions") &&
      webInvitationRowActions.includes("<Send") &&
      webInvitationRowActions.includes("<X") &&
      webInvitationRowActions.includes("<Trash2") &&
      webInvitationRowActions.includes('status === "pending"') &&
      webInvitationRowActions.includes('status === "expired"') &&
      webInvitationRowActions.includes('status === "revoked"') &&
      webInvitationRowActions.includes("statusTone") &&
      webImportJobsPanel.includes("ImportJobRow") &&
      !webImportJobsPanel.includes("function ImportJobRow") &&
      !webImportJobsPanel.includes("<ListActionRow") &&
      webImportJobRow.includes("function ImportJobRow") &&
      webImportJobRow.includes("<ListActionRow") &&
      webImportJobRow.includes("statusTone") &&
      webImportDiagnosticsPanel.includes("ImportDiagnosticsDetails") &&
      !webImportDiagnosticsPanel.includes("<RuntimeRow") &&
      !webImportDiagnosticsPanel.includes("<Timeline") &&
      !webImportDiagnosticsPanel.includes("importRecoveryGuidance") &&
      webImportDiagnosticsDetails.includes("function ImportDiagnosticsDetails") &&
      webImportDiagnosticsDetails.includes("ImportDiagnosticsRuntimeRows") &&
      webImportDiagnosticsDetails.includes("ImportRecoveryPanel") &&
      webImportDiagnosticsDetails.includes("ImportEventTimeline") &&
      !webImportDiagnosticsDetails.includes("<RuntimeRow") &&
      !webImportDiagnosticsDetails.includes("<Timeline") &&
      !webImportDiagnosticsDetails.includes("importRecoveryGuidance") &&
      webImportDiagnosticsRuntimeRows.includes("function ImportDiagnosticsRuntimeRows") &&
      webImportDiagnosticsRuntimeRows.includes("<RuntimeRow") &&
      webImportRecoveryPanel.includes("function ImportRecoveryPanel") &&
      webImportRecoveryPanel.includes("importRecoveryGuidance") &&
      webImportRecoveryPanel.includes("permission.importRetry") &&
      webImportEventTimeline.includes("function ImportEventTimeline") &&
      webImportEventTimeline.includes("importJobTimelineItem") &&
      webImportEventTimeline.includes("<Timeline"),
    "invitation, import job, and import diagnostic row/detail modules must stay split.",
  );
}
