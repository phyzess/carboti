export function assertWebPageInventoryGuards(context) {
  const { assert, exists } = context;

  assert(
    exists("apps/web/src/audit-filters.ts") &&
      exists("apps/web/src/workspace-page-sections/audit-page-filters.tsx") &&
      exists("apps/web/src/workspace-page-sections/audit-page-results.tsx") &&
      exists("apps/web/src/workspace-page-sections/audit-page-details.tsx") &&
      exists("apps/web/src/workspace-page-sections/use-source-selection.ts") &&
      exists("apps/web/src/workspace-page-sections/source-details-content.tsx") &&
      exists("apps/web/src/workspace-page-sections/source-upload-actions.tsx") &&
      exists("apps/web/src/workspace-page-sections/source-upload-queue-items.ts") &&
      exists("apps/web/src/workspace-page-sections/source-batch-actions.tsx") &&
      exists("apps/web/src/workspace-page-sections/source-file-row.tsx") &&
      exists("apps/web/src/workspace-page-sections/invitation-row.tsx") &&
      exists("apps/web/src/workspace-page-sections/invitation-row-details.tsx") &&
      exists("apps/web/src/workspace-page-sections/invitation-row-actions.tsx") &&
      exists("apps/web/src/workspace-page-sections/import-job-row.tsx") &&
      exists("apps/web/src/workspace-page-sections/import-diagnostics-details.tsx") &&
      exists("apps/web/src/workspace-page-sections/import-diagnostics-runtime-rows.tsx") &&
      exists("apps/web/src/workspace-page-sections/import-event-timeline.tsx") &&
      exists("apps/web/src/workspace-page-sections/import-recovery-panel.tsx") &&
      exists("apps/web/src/workspace-page-sections/shared.tsx") &&
      exists("apps/web/src/workspace-page-sections/page-section-ui.tsx") &&
      exists("apps/web/src/workspace-page-sections/import-page-helpers.ts") &&
      exists("apps/web/src/workspace-page-sections/audit-page-helpers.ts") &&
      exists("apps/web/src/workspace-page-sections/overview-page-helpers.ts") &&
      exists("apps/web/src/workspace-page-sections/status-tone.ts"),
    "apps/web page-section support modules must exist.",
  );
}
