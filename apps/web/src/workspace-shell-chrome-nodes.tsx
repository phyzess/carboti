import type { ReactNode } from "react";
import type { AppNavigationPath } from "./app-routes";
import type { ApiUser } from "./types";
import type { WebPermissions } from "./web-permissions";
import type { ShellOverlayState } from "./use-shell-overlay-state";
import type { SearchEntry } from "./workspace-search-types";
import { WorkspaceShellActions, WorkspaceShellOverlays } from "./workspace-shell-chrome";

export type WorkspaceShellChromeNodes = {
  shellActions: ReactNode;
  shellOverlays: ReactNode;
};

export function buildWorkspaceShellChromeNodes(options: {
  disabled: boolean;
  navigate: (path: AppNavigationPath, options?: { replace?: boolean }) => void;
  noticeText: string;
  onLogout: () => void;
  onRefreshWorkspace: () => void;
  overlayState: ShellOverlayState;
  permissions: WebPermissions;
  runtimeEnvironment: string;
  searchEntries: SearchEntry[];
  user: ApiUser | null;
}): WorkspaceShellChromeNodes {
  const {
    disabled,
    navigate,
    noticeText,
    onLogout,
    onRefreshWorkspace,
    overlayState,
    permissions,
    runtimeEnvironment,
    searchEntries,
    user,
  } = options;

  return {
    shellActions: (
      <WorkspaceShellActions
        disabled={disabled}
        overlayState={overlayState}
        user={user}
        onRefreshWorkspace={onRefreshWorkspace}
      />
    ),
    shellOverlays: (
      <WorkspaceShellOverlays
        navigate={navigate}
        noticeText={noticeText}
        overlayState={overlayState}
        permissions={permissions}
        runtimeEnvironment={runtimeEnvironment}
        searchEntries={searchEntries}
        user={user}
        onLogout={onLogout}
      />
    ),
  };
}
