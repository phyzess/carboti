import { GuestActions, ShellActions } from "./workspace-shell-actions";
import { UserPanel, WorkspaceSearchDialog, type SearchEntry } from "./shell-controls";
import type { ApiUser } from "./types";
import type { WebPermissions } from "./web-permissions";
import type { AppNavigationPath } from "./app-routes";
import type { ShellOverlayState } from "./use-shell-overlay-state";

export function WorkspaceShellActions(props: {
  disabled: boolean;
  onRefreshWorkspace: () => void;
  overlayState: ShellOverlayState;
  user: ApiUser | null;
}) {
  if (!props.user) return <GuestActions />;

  return (
    <ShellActions
      disabled={props.disabled}
      onOpenUserPanel={props.overlayState.toggleUserPanel}
      onRefresh={props.onRefreshWorkspace}
      user={props.user}
    />
  );
}

export function WorkspaceShellOverlays(props: {
  navigate: (path: AppNavigationPath, options?: { replace?: boolean }) => void;
  noticeText: string;
  onLogout: () => void;
  overlayState: ShellOverlayState;
  permissions: WebPermissions;
  runtimeEnvironment: string;
  searchEntries: SearchEntry[];
  user: ApiUser | null;
}) {
  if (!props.user) return null;

  return (
    <>
      <WorkspaceSearchDialog
        entries={props.searchEntries}
        open={props.overlayState.searchOpen}
        query={props.overlayState.searchQuery}
        onOpenChange={props.overlayState.setSearchOpen}
        onQueryChange={props.overlayState.setSearchQuery}
      />
      <UserPanel
        canManageUsers={props.permissions.canManageUsers}
        notice={props.noticeText}
        open={props.overlayState.userPanelOpen}
        runtimeEnvironment={props.runtimeEnvironment}
        user={props.user}
        onClose={() => props.overlayState.setUserPanelOpen(false)}
        onLogout={() => {
          props.overlayState.closeShellOverlays();
          props.onLogout();
        }}
        onNavigate={(path) => props.navigate(path)}
      />
    </>
  );
}
