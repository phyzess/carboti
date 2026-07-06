export function assertWebShellHomeGuards(context) {
  const { assert, exists, webSources, workspaceHome } = context;

  assert(
    exists("apps/web/src/workspace-home.tsx") &&
      webSources.includes("WorkspaceHomeSlot") &&
      workspaceHome.includes("WorkspaceHomeProps") &&
      !workspaceHome.includes("auditEvents"),
    "apps/web must expose an app-owned workspace home slot that does not foreground audit events.",
  );
}
