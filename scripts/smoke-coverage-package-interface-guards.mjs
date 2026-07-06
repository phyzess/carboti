export function assertPackageInterfaceCoverageGuards(context) {
  const { assert, packageInterfaceTests } = context;

  assert(
    packageInterfaceTests.includes("createManualReviewIssue") &&
      packageInterfaceTests.includes("stagedRecordKeyForSourceRow") &&
      packageInterfaceTests.includes("passwordResetTokens") &&
      packageInterfaceTests.includes("emailMessages") &&
      packageInterfaceTests.includes("formatPlural") &&
      packageInterfaceTests.includes("localeCandidatesFromAcceptLanguage") &&
      packageInterfaceTests.includes("apiErrorFromResponse") &&
      packageInterfaceTests.includes("Backend validation failed.") &&
      packageInterfaceTests.includes("apiNetworkError"),
    "package interface tests must exercise import-pipeline helpers, db schema exports, i18n helpers, and web API error parsing.",
  );
}
