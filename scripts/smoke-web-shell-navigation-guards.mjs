export function assertWebShellNavigationGuards(context) {
  const {
    assert,
    webAppNavigation,
    webAppNavigationModel,
    webAppRouteNavigation,
    webAppSearch,
    webAppUi,
    webAuthenticatedWorkspaceProps,
    webWorkspaceLoadingShell,
    webWorkspaceShellController,
  } = context;

  assert(
    webAppNavigation.includes("function buildNavigation") &&
      webAppNavigation.includes("type AppNavigationModel") &&
      webAppNavigation.includes("app-navigation-model") &&
      webAppNavigationModel.includes("navigationGroups") &&
      webAppNavigationModel.includes("routeMeta") &&
      webAppNavigationModel.includes("function buildNavigationRouteEntries") &&
      webAppNavigationModel.includes("function routeAvailable") &&
      webAppSearch.includes("app-navigation-model") &&
      webAppRouteNavigation.includes("function useAppRouteNavigation") &&
      webAppRouteNavigation.includes("useLocation") &&
      webAppRouteNavigation.includes("useNavigate") &&
      webAppRouteNavigation.includes("authRouteFromPath") &&
      webAppRouteNavigation.includes("appRouteFromPath") &&
      webAuthenticatedWorkspaceProps.includes("app-navigation") &&
      webWorkspaceShellController.includes("app-navigation") &&
      webWorkspaceLoadingShell.includes("app-navigation") &&
      !webAppUi.includes("function buildNavigation") &&
      !webAppUi.includes("type AppNavigationModel") &&
      !webAppNavigation.includes("descriptionKey") &&
      !webAppUi.includes("WorkspaceRouteEntry"),
    "web route navigation model must live in app-navigation-model while app-navigation adapts it to shell UI items.",
  );
}
