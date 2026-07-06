export function assertWebWorkflowInventoryGuards(context) {
  const { assert, exists } = context;

  assert(
    exists("apps/web/src/review-console-summary-panel.tsx") &&
      exists("apps/web/src/review-console-source-panel.tsx") &&
      exists("apps/web/src/review-console-upload-queue.tsx") &&
      exists("apps/web/src/review-console-source-list.tsx") &&
      exists("apps/web/src/review-console-import-jobs-panel.tsx") &&
      exists("apps/web/src/review-console-types.ts") &&
      exists("apps/web/src/review-workspace-route-props.ts") &&
      exists("apps/web/src/app-controller-workspace-props.ts") &&
      exists("apps/web/src/app-controller-workspace-prop-sections.ts") &&
      exists("apps/web/src/app-controller-workspace-prop-types.ts") &&
      exists("apps/web/src/use-app-route-navigation.ts") &&
      exists("apps/web/src/use-app-actions.ts") &&
      exists("apps/web/src/auth-workflow-actions.ts") &&
      exists("apps/web/src/auth-session-actions.ts") &&
      exists("apps/web/src/auth-password-reset-actions.ts") &&
      exists("apps/web/src/user-management-actions.ts") &&
      exists("apps/web/src/upload-queue-actions.ts") &&
      exists("apps/web/src/use-workspace-review-data.ts") &&
      exists("apps/web/src/review-job-actions.ts") &&
      exists("apps/web/src/review-record-actions.ts") &&
      exists("apps/web/src/review-record-decision-actions.ts") &&
      exists("apps/web/src/review-commit-actions.ts") &&
      exists("apps/web/src/review-advisory-actions.ts") &&
      exists("apps/web/src/review-console-helpers.ts") &&
      exists("apps/web/src/review-console-advisory-item.tsx") &&
      exists("apps/web/src/review-record-row.tsx") &&
      exists("apps/web/src/review-records-empty-state.tsx") &&
      exists("apps/web/src/upload-queue-state.ts") &&
      exists("apps/web/src/web-permissions.ts"),
    "apps/web workflow, review, upload, and permission support modules must exist.",
  );
}
