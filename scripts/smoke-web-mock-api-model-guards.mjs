export function assertWebMockApiModelGuards(context) {
  const {
    assert,
    webMockApiContentRecords,
    webMockApiEntityModel,
    webMockApiEventModel,
    webMockApiIdentifiers,
    webMockApiInvitationModel,
    webMockApiModel,
    webMockApiSupport,
    webMockApiTime,
    webMockApiValues,
  } = context;

  assert(
    webMockApiModel.includes("mock-api-content-records") &&
      webMockApiModel.includes("mock-api-event-model") &&
      webMockApiModel.includes("mock-api-entity-model") &&
      !webMockApiModel.includes("function recordsFromContent") &&
      !webMockApiModel.includes("function jobEvent") &&
      !webMockApiModel.includes("function auditEvent") &&
      !webMockApiModel.includes("function invitation") &&
      !webMockApiModel.includes("function nowIso") &&
      !webMockApiModel.includes("function shortId") &&
      !webMockApiModel.includes("function normalizedEmail") &&
      webMockApiEntityModel.includes("function user") &&
      webMockApiEntityModel.includes("function sourceFile") &&
      webMockApiEntityModel.includes("function importJob") &&
      webMockApiEntityModel.includes("function stagedRecord") &&
      webMockApiContentRecords.includes("function recordsFromContent") &&
      webMockApiContentRecords.includes("stagedRecord") &&
      webMockApiEventModel.includes("function jobEvent") &&
      webMockApiEventModel.includes("function auditEvent") &&
      webMockApiInvitationModel.includes("type MockInvitation") &&
      webMockApiInvitationModel.includes("function invitationResponse") &&
      webMockApiIdentifiers.includes("function hashString") &&
      webMockApiTime.includes("function oneDayFromNow") &&
      webMockApiValues.includes("function normalizedEmail") &&
      webMockApiSupport.includes("mock-api-invitation-model") &&
      webMockApiSupport.includes("mock-api-identifiers") &&
      webMockApiSupport.includes("mock-api-time") &&
      webMockApiSupport.includes("mock-api-values"),
    "mock API model support must keep entity, content-record, event, invitation, id, time, and value helpers split.",
  );
}
