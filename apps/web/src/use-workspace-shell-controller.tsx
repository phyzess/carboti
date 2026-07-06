import { useMemo, type ReactNode } from "react";
import { buildNavigation, type AppNavigationModel } from "./app-navigation";
import { type AppNavigationPath, type AppRoute } from "./app-routes";
import { useI18n } from "./i18n";
import type { ApiUser, AuditEvent, ImportJobListItem, SourceFile } from "./types";
import type { WebPermissions } from "./web-permissions";
import { useShellOverlayState } from "./use-shell-overlay-state";
import { buildWorkspaceShellChromeNodes } from "./workspace-shell-chrome-nodes";
import { useWorkspaceShellSearchEntries } from "./workspace-shell-search";

export function useWorkspaceShellController(options: {
  auditEvents: AuditEvent[];
  importJobs: ImportJobListItem[];
  isBusy: boolean;
  navigate: (path: AppNavigationPath, options?: { replace?: boolean }) => void;
  noticeText: string;
  onLogout: () => void;
  onRefreshWorkspace: () => void;
  onSelectJob: (jobId: string) => void;
  permissions: WebPermissions;
  route: AppRoute;
  runtimeEnvironment: string;
  sourceFiles: SourceFile[];
  user: ApiUser | null;
  users: ApiUser[];
}): {
  closeShellOverlays: () => void;
  navigationModel: AppNavigationModel;
  openSearch: () => void;
  shellActions: ReactNode;
  shellOverlays: ReactNode;
} {
  const i18n = useI18n();
  const { t } = i18n;
  const {
    auditEvents,
    importJobs,
    isBusy,
    navigate,
    noticeText,
    onLogout,
    onRefreshWorkspace,
    onSelectJob,
    permissions,
    route,
    runtimeEnvironment,
    sourceFiles,
    user,
    users,
  } = options;
  const overlayState = useShellOverlayState({ route, user });

  const navigationModel = useMemo<AppNavigationModel>(
    () =>
      buildNavigation(route, {
        authenticated: Boolean(user),
        canManageUsers: permissions.canManageUsers,
        onNavigate: (path) => navigate(path),
        t,
      }),
    [navigate, permissions.canManageUsers, route, t, user],
  );
  const searchEntries = useWorkspaceShellSearchEntries({
    auditEvents,
    formatters: i18n,
    importJobs,
    navigate,
    navigationModel,
    onSelectJob,
    sourceFiles,
    user,
    users,
  });

  const { shellActions, shellOverlays } = buildWorkspaceShellChromeNodes({
    disabled: isBusy,
    navigate,
    noticeText,
    onLogout,
    onRefreshWorkspace,
    overlayState,
    permissions,
    runtimeEnvironment,
    searchEntries,
    user,
  });

  return {
    closeShellOverlays: overlayState.closeShellOverlays,
    navigationModel,
    openSearch: overlayState.openSearch,
    shellActions,
    shellOverlays,
  };
}
