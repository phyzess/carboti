export function assertWebAuditPageGuards(context) {
  const {
    assert,
    webAuditFilters,
    webAuditPage,
    webAuditPageDetails,
    webAuditPageFilters,
    webAuditPageResults,
  } = context;

  assert(
    webAuditFilters.includes("auditFilterQuery") &&
      webAuditPage.includes("AuditFilterPanel") &&
      webAuditPage.includes("AuditResultsPanel") &&
      webAuditPage.includes("AuditEventDetailsPanel") &&
      !webAuditPage.includes("<FilterBar") &&
      !webAuditPage.includes("<DataToolbar") &&
      !webAuditPage.includes("<RuntimeRow") &&
      webAuditPageFilters.includes("function AuditFilterPanel") &&
      webAuditPageFilters.includes("<FilterBar") &&
      webAuditPageResults.includes("function AuditResultsPanel") &&
      webAuditPageResults.includes("function AuditEventRow") &&
      webAuditPageDetails.includes("function AuditEventDetailsPanel") &&
      webAuditPageDetails.includes("<RuntimeRow"),
    "audit page filters, results, and details must stay in focused page-section modules.",
  );
}
