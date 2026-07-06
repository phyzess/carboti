export function assertPackageInterfaceCoverageGuards(context) {
  const { assert, packageInterfaceTests } = context;

  assert(
    packageInterfaceTests.includes("createManualReviewIssue") &&
      packageInterfaceTests.includes("stagedRecordKeyForSourceRow") &&
      packageInterfaceTests.includes("passwordResetTokens") &&
      packageInterfaceTests.includes("emailMessages") &&
      packageInterfaceTests.includes("formatPlural") &&
      packageInterfaceTests.includes("localeCandidatesFromAcceptLanguage") &&
      packageInterfaceTests.includes("CarbotiClient") &&
      packageInterfaceTests.includes("CarbotiApiError") &&
      packageInterfaceTests.includes("runCarbotiCli") &&
      packageInterfaceTests.includes("init command") &&
      packageInterfaceTests.includes("apiErrorFromResponse") &&
      packageInterfaceTests.includes("Backend validation failed.") &&
      packageInterfaceTests.includes("apiNetworkError"),
    "package interface tests must exercise import-pipeline helpers, db schema exports, i18n helpers, sdk client errors, cli commands, and web API error parsing.",
  );
}
