export function assertWebTopLevelCompositionGuards(context) {
  const {
    assert,
    webApp,
    webAppController,
    webAppControllerRouteGateProps,
    webAppControllerWorkspacePropSections,
    webAppControllerWorkspaceProps,
    webAppControllerWorkspacePropTypes,
    webAppRouteNavigation,
    webAuthenticatedWorkspace,
  } = context;

  assert(
    webApp.includes("useAppController") &&
      !webApp.includes("GuestAuthPage") &&
      !webApp.includes("async function runAction") &&
      !webApp.includes("async function handleApplyAuditFilters") &&
      !webApp.includes("function auditFilterQuery") &&
      !webApp.includes("function buildWebPermissions") &&
      !webApp.includes("function createUploadQueueEntries") &&
      !webApp.includes("useWorkspaceData") &&
      !webApp.includes("useAuthWorkflow") &&
      !webApp.includes("renderAppRouteGate") &&
      webAppController.includes("renderAppRouteGate") &&
      webAppController.includes("buildAppRouteGateProps") &&
      webAppController.includes("useWorkspaceData") &&
      webAppController.includes("useAuthWorkflow") &&
      webAppController.includes("useAppRouteNavigation") &&
      !webAppController.includes("useLocation") &&
      !webAppController.includes("useNavigate") &&
      !webAppController.includes("authRouteFromPath") &&
      !webAppController.includes("appRouteFromPath") &&
      !webAppController.includes("onInviteAccept:") &&
      !webAppController.includes("onRoutePasswordReset:") &&
      webAppRouteNavigation.includes("useLocation") &&
      webAppRouteNavigation.includes("useNavigate") &&
      webAppRouteNavigation.includes("authRouteFromPath") &&
      webAppRouteNavigation.includes("appRouteFromPath") &&
      webAppControllerRouteGateProps.includes("buildAppRouteGateProps") &&
      webAppControllerRouteGateProps.includes("AppRouteGateProps") &&
      webAppControllerRouteGateProps.includes("onInviteAccept: authWorkflow.handleInviteAccept") &&
      webAppControllerRouteGateProps.includes(
        "onRoutePasswordReset: authWorkflow.handleRoutePasswordReset",
      ) &&
      webAppController.includes("buildAuthenticatedWorkspaceProps") &&
      webAppController.includes("AuthenticatedWorkspaceProps") &&
      webAppController.includes("workspaceProps") &&
      webAppControllerWorkspaceProps.includes("AuthenticatedWorkspaceProps") &&
      webAppControllerWorkspaceProps.includes("buildAuthenticatedWorkspaceProps") &&
      webAppControllerWorkspaceProps.includes("buildAuthenticatedWorkspaceReviewProps") &&
      !webAppControllerWorkspaceProps.includes("reviewActions.commitApproved") &&
      !webAppControllerWorkspaceProps.includes("workspaceData.reviewRecords") &&
      webAppControllerWorkspacePropSections.includes("workspaceData.reviewRecords") &&
      webAppControllerWorkspacePropSections.includes("shellController.shellActions") &&
      webAppControllerWorkspacePropTypes.includes("BuildAuthenticatedWorkspacePropsOptions") &&
      webAppControllerWorkspacePropTypes.includes("ReturnType<typeof useWorkspaceData>") &&
      !webApp.includes("adminError={adminError}") &&
      !webApp.includes("aiAdvisories={aiAdvisories}") &&
      !webAuthenticatedWorkspace.includes('from "./authenticated-workspace-routes"') &&
      !webAuthenticatedWorkspace.includes('from "./app-workspace-shell"') &&
      !webAuthenticatedWorkspace.includes('from "./review-console"') &&
      !webAuthenticatedWorkspace.includes('from "./workspace-pages"'),
    "apps/web top-level composition files must not regain workflow and route implementation details.",
  );
}
