export function createSmokeWebShellContext({ text }) {
  const webApp = text("apps/web/src/app.tsx");
  const webAppController = text("apps/web/src/use-app-controller.ts");
  const webAppControllerRouteGateProps = text("apps/web/src/app-controller-route-gate-props.ts");
  const webAppControllerWorkspaceProps = text("apps/web/src/app-controller-workspace-props.ts");
  const webAppControllerWorkspacePropSections = text(
    "apps/web/src/app-controller-workspace-prop-sections.ts",
  );
  const webAppControllerWorkspacePropTypes = text(
    "apps/web/src/app-controller-workspace-prop-types.ts",
  );
  const webAppUi = text("apps/web/src/app-ui.tsx");
  const webAppNavigation = text("apps/web/src/app-navigation.tsx");
  const webAppNavigationModel = text("apps/web/src/app-navigation-model.ts");
  const webAppRouteNavigation = text("apps/web/src/use-app-route-navigation.ts");
  const webAppSearch = text("apps/web/src/app-search.ts");
  const webAppActions = text("apps/web/src/use-app-actions.ts");
  const webAppRouteGate = text("apps/web/src/app-route-gate.tsx");
  const webAppSession = text("apps/web/src/app-session.ts");
  const webAuthWorkflow = text("apps/web/src/use-auth-workflow.ts");
  const webAuthWorkflowActions = text("apps/web/src/auth-workflow-actions.ts");
  const webAuthSessionActions = text("apps/web/src/auth-session-actions.ts");
  const webAuthSessionCompletion = text("apps/web/src/auth-session-completion.ts");
  const webAuthPasswordResetActions = text("apps/web/src/auth-password-reset-actions.ts");
  const webUserManagement = text("apps/web/src/use-user-management.ts");
  const webUserManagementActions = text("apps/web/src/user-management-actions.ts");
  const webUploadController = text("apps/web/src/use-upload-controller.ts");
  const webUploadQueueActions = text("apps/web/src/upload-queue-actions.ts");
  const webUploadQueueBatch = text("apps/web/src/upload-queue-batch.ts");
  const webWorkspaceData = text("apps/web/src/use-workspace-data.ts");
  const webWorkspaceReviewData = text("apps/web/src/use-workspace-review-data.ts");
  const webAuthenticatedWorkspace = text("apps/web/src/authenticated-workspace.tsx");
  const webAuthenticatedWorkspaceProps = text("apps/web/src/authenticated-workspace-props.ts");
  const webWorkspaceShellRoutes = text("apps/web/src/workspace-shell-routes.tsx");
  const webWorkspaceShellRouteContent = text("apps/web/src/workspace-shell-route-content.tsx");
  const webWorkspaceShellRouteContentTypes = text(
    "apps/web/src/workspace-shell-route-content-types.ts",
  );
  const webWorkspaceRouteSettingsContent = text(
    "apps/web/src/workspace-route-settings-content.tsx",
  );
  const webWorkspaceRouteWorkspaceContent = text(
    "apps/web/src/workspace-route-workspace-content.tsx",
  );
  const webWorkspaceNotFoundRoute = text("apps/web/src/workspace-not-found-route.tsx");
  const webAppWorkspaceShell = text("apps/web/src/app-workspace-shell.tsx");
  const webWorkspaceShellController = text("apps/web/src/use-workspace-shell-controller.tsx");
  const webShellOverlayState = text("apps/web/src/use-shell-overlay-state.ts");
  const webWorkspaceShellChrome = text("apps/web/src/workspace-shell-chrome.tsx");
  const webWorkspaceShellChromeNodes = text("apps/web/src/workspace-shell-chrome-nodes.tsx");
  const webWorkspaceShellSearch = text("apps/web/src/workspace-shell-search.ts");
  const webShellControls = text("apps/web/src/shell-controls.tsx");
  const webWorkspaceSearchDialog = text("apps/web/src/workspace-search-dialog.tsx");
  const webWorkspaceSearchFilter = text("apps/web/src/workspace-search-filter.ts");
  const webWorkspaceSearchResults = text("apps/web/src/workspace-search-results.tsx");
  const webWorkspaceSearchTypes = text("apps/web/src/workspace-search-types.ts");
  const webWorkspaceShellActions = text("apps/web/src/workspace-shell-actions.tsx");
  const webWorkspaceLoadingShell = text("apps/web/src/workspace-loading-shell.tsx");

  return {
    webApp,
    webAppActions,
    webAppController,
    webAppControllerRouteGateProps,
    webAppControllerWorkspacePropSections,
    webAppControllerWorkspaceProps,
    webAppControllerWorkspacePropTypes,
    webAppNavigation,
    webAppNavigationModel,
    webAppRouteGate,
    webAppRouteNavigation,
    webAppSearch,
    webAppSession,
    webAppUi,
    webAppWorkspaceShell,
    webAuthPasswordResetActions,
    webAuthSessionCompletion,
    webAuthSessionActions,
    webAuthWorkflow,
    webAuthWorkflowActions,
    webAuthenticatedWorkspace,
    webAuthenticatedWorkspaceProps,
    webShellControls,
    webShellOverlayState,
    webUploadController,
    webUploadQueueActions,
    webUploadQueueBatch,
    webUserManagement,
    webUserManagementActions,
    webWorkspaceData,
    webWorkspaceLoadingShell,
    webWorkspaceNotFoundRoute,
    webWorkspaceReviewData,
    webWorkspaceSearchDialog,
    webWorkspaceSearchFilter,
    webWorkspaceSearchResults,
    webWorkspaceSearchTypes,
    webWorkspaceShellRouteContent,
    webWorkspaceShellRouteContentTypes,
    webWorkspaceShellActions,
    webWorkspaceShellChrome,
    webWorkspaceShellChromeNodes,
    webWorkspaceShellController,
    webWorkspaceShellSearch,
    webWorkspaceShellRoutes,
    webWorkspaceRouteSettingsContent,
    webWorkspaceRouteWorkspaceContent,
  };
}
