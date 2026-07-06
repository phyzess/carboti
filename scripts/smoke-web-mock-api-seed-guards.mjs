export function assertWebMockApiSeedGuards(context) {
  const {
    assert,
    webMockApiSeedAudit,
    webMockApiSeedGraph,
    webMockApiSeedInvitations,
    webMockApiSeedReview,
    webMockApiSeedState,
  } = context;

  assert(
    webMockApiSeedState.includes("createSeedGraph") &&
      webMockApiSeedState.includes("createSeedReview") &&
      webMockApiSeedState.includes("createSeedInvitations") &&
      webMockApiSeedState.includes("createSeedAuditEvents") &&
      !webMockApiSeedState.includes("demo-intake-alpha") &&
      !webMockApiSeedState.includes("demo-advisory-1") &&
      !webMockApiSeedState.includes("ai_advisory.generated") &&
      webMockApiSeedGraph.includes("function createSeedGraph") &&
      webMockApiSeedGraph.includes("demo-intake-alpha") &&
      webMockApiSeedGraph.includes("adapter_missing") &&
      webMockApiSeedInvitations.includes("function createSeedInvitations") &&
      webMockApiSeedInvitations.includes("mail-failure@example.com") &&
      webMockApiSeedInvitations.includes("latestEmailStatus") &&
      webMockApiSeedReview.includes("function createSeedReview") &&
      webMockApiSeedReview.includes("demo-advisory-1") &&
      webMockApiSeedReview.includes("value_out_of_range") &&
      webMockApiSeedReview.includes("stagedRecord") &&
      webMockApiSeedAudit.includes("function createSeedAuditEvents") &&
      webMockApiSeedAudit.includes("ai_advisory.generated"),
    "mock API seed graph, invitation, review, and audit fixtures must stay split.",
  );
}
