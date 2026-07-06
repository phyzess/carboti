export function assertUiAppUsageGuards(context) {
  const { assert, browserSmoke, webApiSources, webSources, workerSources } = context;

  assert(
    !webSources.includes("@base-ui/react") && !webSources.includes("@base-ui-components/react"),
    "apps/web must consume qitu UI primitives instead of importing Base UI directly.",
  );
  assert(
    webSources.includes("<DateField") &&
      webSources.includes("<FilterBar") &&
      webSources.includes("<DataToolbar") &&
      webSources.includes("<DetailDrawer") &&
      webSources.includes("<ListActionRow") &&
      webSources.includes("TableCell") &&
      webSources.includes("<TableScrollArea") &&
      webSources.includes("<ListFrame") &&
      webSources.includes("<SegmentedControl") &&
      webSources.includes("uploadQueue") &&
      webSources.includes("compact={compactUpload}") &&
      webSources.includes("completedEntryIds") &&
      !webSources.includes("tabClass") &&
      !webSources.includes("<button") &&
      !webSources.includes("<input") &&
      !webSources.includes("<select") &&
      !webSources.includes("<textarea") &&
      !webSources.includes("<dialog") &&
      !webSources.includes("<table") &&
      !webSources.includes("<thead") &&
      !webSources.includes("<tbody") &&
      !webSources.includes('type="date"') &&
      !webSources.includes('type="checkbox"'),
    "apps/web must use shared qitu primitives for common interactive controls once those primitives exist.",
  );
  assert(
    webSources.includes('<TableScrollArea variant="bounded">') &&
      !webSources.includes("overflow-x-auto px-3 pb-4") &&
      browserSmoke.includes('.qitu-table-scroll-area[data-variant="bounded"]'),
    "review console staged records must use the shared bounded TableScrollArea instead of page-local table overflow.",
  );
  assert(
    webApiSources.includes("occurredAfter") &&
      webApiSources.includes("occurredBefore") &&
      workerSources.includes("invalid_audit_date_filter") &&
      workerSources.includes("occurred_at >= ?") &&
      workerSources.includes("occurred_at < ?"),
    "audit filters must use shared DateField values backed by Worker ISO date-range filtering.",
  );
}
