import { useMemo, type ReactNode } from "react";
import { buildAppRouteGateProps } from "./app-controller-route-gate-props";
import { buildAuthenticatedWorkspaceProps } from "./app-controller-workspace-props";
import { renderAppRouteGate } from "./app-route-gate";
import type { AuthenticatedWorkspaceProps } from "./authenticated-workspace-props";
import { useI18n } from "./i18n";
import { useAppActionRunner, useWorkspaceActions } from "./use-app-actions";
import { useAppRouteNavigation } from "./use-app-route-navigation";
import { useAuthWorkflow } from "./use-auth-workflow";
import { useReviewActions } from "./use-review-actions";
import { useUploadController } from "./use-upload-controller";
import { useUserManagement } from "./use-user-management";
import { useWorkspaceData } from "./use-workspace-data";
import { useWorkspaceRouteLifecycle } from "./use-workspace-route-lifecycle";
import { useWorkspaceShellController } from "./use-workspace-shell-controller";
import { useWorkspaceViewModel } from "./use-workspace-view-model";
import { buildWebPermissions, defaultWebPermissions, type WebPermissions } from "./web-permissions";

export type AppControllerState = {
  routeGate: ReactNode | null;
  workspaceProps: AuthenticatedWorkspaceProps | null;
};

export function useAppController(): AppControllerState {
  const { formatStatus, t } = useI18n();
  const { authRoute, locationPathname, navigate, route } = useAppRouteNavigation();
  const actionRunner = useAppActionRunner();
  const workspaceData = useWorkspaceData({
    setError: actionRunner.setError,
    setNotice: actionRunner.setNotice,
  });
  const authWorkflow = useAuthWorkflow({
    authRoute,
    clearWorkspace,
    loadWorkspace: workspaceData.loadWorkspace,
    navigate,
    route,
    runAction: actionRunner.runAction,
    setError: actionRunner.setError,
    setNotice: actionRunner.setNotice,
    t,
  });
  const permissions = useMemo<WebPermissions>(() => {
    return authWorkflow.user ? buildWebPermissions(authWorkflow.user) : defaultWebPermissions;
  }, [authWorkflow.user]);
  const userManagement = useUserManagement({
    canManageUsers: permissions.canManageUsers,
    setBusy: actionRunner.setBusy,
    setGlobalError: actionRunner.setError,
    setNotice: actionRunner.setNotice,
    user: authWorkflow.user,
  });
  const uploadController = useUploadController({
    loadWorkspace: workspaceData.loadWorkspace,
    setBusy: actionRunner.setBusy,
    setError: actionRunner.setError,
    setNotice: actionRunner.setNotice,
    t,
  });
  const reviewActions = useReviewActions({
    formatStatus,
    loadReview: workspaceData.loadReview,
    loadWorkspace: workspaceData.loadWorkspace,
    navigate,
    reviewRecords: workspaceData.reviewRecords,
    route,
    runAction: actionRunner.runAction,
    selectedJobId: workspaceData.selectedJobId,
    setNotice: actionRunner.setNotice,
    setReviewRecords: workspaceData.setReviewRecords,
    setSelectedJobId: workspaceData.setSelectedJobId,
  });
  const noticeText = t(actionRunner.notice.key, actionRunner.notice.values);
  const viewModel = useWorkspaceViewModel({
    formatStatus,
    hasLoadedUserManagement: userManagement.hasLoadedUserManagement,
    importJobs: workspaceData.importJobs,
    permissions,
    reviewRecords: workspaceData.reviewRecords,
    route,
    selectedJobId: workspaceData.selectedJobId,
  });
  useWorkspaceRouteLifecycle({
    authRoute,
    isLoadingSession: authWorkflow.isLoadingSession,
    isReviewLoaded: workspaceData.isReviewLoaded,
    loadReview: workspaceData.loadReview,
    loadUserManagement: userManagement.loadUserManagement,
    locationPathname,
    navigate,
    permissions,
    route,
    runAction: actionRunner.runAction,
    selectedJobId: workspaceData.selectedJobId,
    user: authWorkflow.user,
  });
  const workspaceActions = useWorkspaceActions({
    auditFilterDraft: workspaceData.auditFilterDraft,
    auditFilters: workspaceData.auditFilters,
    loadAuditPageEvents: workspaceData.loadAuditPageEvents,
    loadUserManagement: userManagement.loadUserManagement,
    loadWorkspace: workspaceData.loadWorkspace,
    route,
    runAction: actionRunner.runAction,
    setAuditFilterDraft: workspaceData.setAuditFilterDraft,
    setAuditFilters: workspaceData.setAuditFilters,
    setNotice: actionRunner.setNotice,
  });
  const shellController = useWorkspaceShellController({
    auditEvents: workspaceData.auditEvents,
    importJobs: workspaceData.importJobs,
    isBusy: actionRunner.isBusy,
    navigate,
    noticeText,
    onLogout: () => void authWorkflow.handleLogout(),
    onRefreshWorkspace: () => void workspaceActions.handleRefreshWorkspace(),
    onSelectJob: (jobId) => void reviewActions.selectJob(jobId),
    permissions,
    route,
    runtimeEnvironment: authWorkflow.runtimeEnvironment,
    sourceFiles: workspaceData.sourceFiles,
    user: authWorkflow.user,
    users: userManagement.users,
  });

  function clearWorkspace() {
    workspaceData.resetWorkspaceData();
    userManagement.resetUserManagement();
    uploadController.resetUploadQueue();
  }

  const routeGate = renderAppRouteGate(
    buildAppRouteGateProps({
      actionRunner,
      authRoute,
      authWorkflow,
      noticeText,
      route,
    }),
  );
  if (routeGate) {
    return {
      routeGate,
      workspaceProps: null,
    };
  }

  if (!authWorkflow.user) {
    return {
      routeGate: null,
      workspaceProps: null,
    };
  }

  return {
    routeGate: null,
    workspaceProps: buildAuthenticatedWorkspaceProps({
      actionRunner,
      authSession: authWorkflow,
      navigate,
      noticeText,
      permissions,
      reviewActions,
      route,
      shellController,
      uploadController,
      user: authWorkflow.user,
      userManagement,
      viewModel,
      workspaceActions,
      workspaceData,
    }),
  };
}
