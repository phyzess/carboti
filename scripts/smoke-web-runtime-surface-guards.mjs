export function assertWebRuntimeSurfaceGuards(context) {
  const { assert, webApiSources, webAuthRoute, webSources } = context;

  assert(
    webSources.includes("Staged records") &&
      webSources.includes("Event stream") &&
      webSources.includes("Audit timeline") &&
      webSources.includes("AI advisory") &&
      webSources.includes("Commit confirmed") &&
      webSources.includes("Confirm selected") &&
      webSources.includes("Commit selected") &&
      webSources.includes("TimeSeriesChart") &&
      webSources.includes("Source files") &&
      webSources.includes("Process local queue") &&
      webSources.includes("Accept invitation") &&
      webSources.includes("Reset password") &&
      webSources.includes("Members and invitations") &&
      webSources.includes("Account") &&
      webSources.includes("buildNavigation") &&
      webSources.includes("authRouteFromPath") &&
      webSources.includes("useNavigate") &&
      webAuthRoute.includes('kind === "invite"') &&
      webAuthRoute.includes('kind === "reset-password"') &&
      webSources.includes("requestPasswordReset") &&
      webSources.includes("confirmPasswordReset") &&
      webSources.includes("uploadSourceFile") &&
      webSources.includes("approveStagedRecord") &&
      webSources.includes("rejectStagedRecord") &&
      webSources.includes("generateAiAdvisory") &&
      webSources.includes("confirmAiAdvisory") &&
      webSources.includes("dismissAiAdvisory") &&
      webSources.includes("commitImportJob") &&
      webSources.includes("retryImportJob") &&
      webSources.includes("Retry job") &&
      webSources.includes("listAuditEvents"),
    "web app must render and call the API-backed auth reset, review console, source files, AI advisory, decisions, commit, retry, and audit timeline.",
  );
  assert(
    webApiSources.includes("confirmPendingStagedRecords") &&
      webApiSources.includes("/review/confirm-pending") &&
      webSources.includes("confirmPendingStagedRecords"),
    "web batch confirmation must call the backend confirm-pending route instead of looping per record.",
  );
}
