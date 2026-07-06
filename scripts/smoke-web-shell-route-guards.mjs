export function assertWebShellRouteGuards(context) {
  const {
    assert,
    exists,
    webAppRouteGate,
    webAppWorkspaceShell,
    webAuthenticatedWorkspace,
    webReviewWorkspaceRoute,
    webShellOverlayState,
    webWorkspaceLoadingShell,
    webWorkspaceNotFoundRoute,
    webWorkspaceRouteSettingsContent,
    webWorkspaceRouteWorkspaceContent,
    webWorkspaceShellActions,
    webWorkspaceShellChrome,
    webWorkspaceShellChromeNodes,
    webWorkspaceShellController,
    webWorkspaceShellRouteContent,
    webWorkspaceShellRouteContentTypes,
    webWorkspaceShellRoutes,
    webWorkspaceShellSearch,
  } = context;

  assert(
    webAuthenticatedWorkspace.includes("props: AuthenticatedWorkspaceProps") &&
      webAuthenticatedWorkspace.includes("ReviewWorkspaceRoute") &&
      webAuthenticatedWorkspace.includes("WorkspaceShellRoutes") &&
      webReviewWorkspaceRoute.includes("function ReviewWorkspaceRoute") &&
      webWorkspaceShellRoutes.includes("function WorkspaceShellRoutes") &&
      webWorkspaceShellRoutes.includes("WorkspaceShellRouteContent") &&
      !webWorkspaceShellRoutes.includes("SourcesPage") &&
      !webWorkspaceShellRoutes.includes("UsersPage") &&
      webWorkspaceShellRouteContent.includes("function WorkspaceShellRouteContent") &&
      webWorkspaceShellRouteContent.includes("WorkspaceSourcesRouteContent") &&
      webWorkspaceShellRouteContent.includes("SettingsUsersRouteContent") &&
      !webWorkspaceShellRouteContent.includes("SourcesPage") &&
      !webWorkspaceShellRouteContent.includes("UsersPage") &&
      !webWorkspaceShellRouteContent.includes("WorkspaceHomeSlot") &&
      webWorkspaceShellRouteContentTypes.includes("WorkspaceShellRouteContentProps") &&
      webWorkspaceRouteWorkspaceContent.includes("WorkspaceHomeSlot") &&
      webWorkspaceRouteWorkspaceContent.includes("SourcesPage") &&
      webWorkspaceRouteWorkspaceContent.includes("ImportsPage") &&
      webWorkspaceRouteSettingsContent.includes("AuditPage") &&
      webWorkspaceRouteSettingsContent.includes("UsersPage") &&
      webWorkspaceRouteSettingsContent.includes("AccountPage") &&
      webWorkspaceShellRouteContent.includes("WorkspaceNotFoundRoute") &&
      !webWorkspaceShellRouteContent.includes("defaultAuthenticatedPath") &&
      !webWorkspaceShellRouteContent.includes("function WorkspaceNotFoundRoute") &&
      webWorkspaceNotFoundRoute.includes("function WorkspaceNotFoundRoute") &&
      webWorkspaceNotFoundRoute.includes("defaultAuthenticatedPath") &&
      webWorkspaceNotFoundRoute.includes("route.notFound") &&
      webAppRouteGate.includes("workspace-loading-shell") &&
      webAppWorkspaceShell.includes("function WorkspaceShell") &&
      !webAppWorkspaceShell.includes("ProtectedWorkspaceLoading") &&
      !webAppWorkspaceShell.includes("WorkspaceLoadingActions") &&
      !webAppWorkspaceShell.includes("function GuestActions") &&
      !webAppWorkspaceShell.includes("function ShellActions") &&
      webWorkspaceShellController.includes("useShellOverlayState") &&
      webWorkspaceShellController.includes("useWorkspaceShellSearchEntries") &&
      webWorkspaceShellController.includes("buildWorkspaceShellChromeNodes") &&
      webShellOverlayState.includes("function useShellOverlayState") &&
      webShellOverlayState.includes("window.addEventListener") &&
      webWorkspaceShellSearch.includes("function useWorkspaceShellSearchEntries") &&
      webWorkspaceShellSearch.includes("buildSearchEntries") &&
      webWorkspaceShellSearch.includes("navigationModel.routeEntries") &&
      webWorkspaceShellChromeNodes.includes("function buildWorkspaceShellChromeNodes") &&
      webWorkspaceShellChromeNodes.includes("WorkspaceShellActions") &&
      webWorkspaceShellChromeNodes.includes("WorkspaceShellOverlays") &&
      webWorkspaceShellChrome.includes("function WorkspaceShellOverlays") &&
      webWorkspaceShellChrome.includes("WorkspaceSearchDialog") &&
      webWorkspaceShellChrome.includes("UserPanel") &&
      webWorkspaceShellChrome.includes("workspace-shell-actions") &&
      !webWorkspaceShellChrome.includes("app-workspace-shell") &&
      webWorkspaceShellActions.includes("function GuestActions") &&
      webWorkspaceShellActions.includes("function ShellActions") &&
      webWorkspaceLoadingShell.includes("function ProtectedWorkspaceLoading") &&
      webWorkspaceLoadingShell.includes("function WorkspaceLoadingActions") &&
      webWorkspaceLoadingShell.includes("buildNavigation") &&
      !webWorkspaceShellController.includes("buildSearchEntries") &&
      !webWorkspaceShellController.includes("WorkspaceShellActions") &&
      !webWorkspaceShellController.includes("WorkspaceShellOverlays") &&
      !webWorkspaceShellController.includes("WorkspaceSearchDialog") &&
      !webWorkspaceShellController.includes("window.addEventListener") &&
      !exists("apps/web/src/authenticated-workspace-routes.tsx"),
    "web shell route and overlay composition must stay split across app-owned shell modules.",
  );
}
