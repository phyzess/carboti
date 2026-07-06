import type { WorkspaceShellRouteContentProps } from "./workspace-shell-route-content-types";
import {
  SettingsAccountRouteContent,
  SettingsAuditRouteContent,
  SettingsUsersRouteContent,
} from "./workspace-route-settings-content";
import {
  WorkspaceImportsRouteContent,
  WorkspaceOverviewRouteContent,
  WorkspaceSourcesRouteContent,
} from "./workspace-route-workspace-content";
import { WorkspaceNotFoundRoute, workspaceNotFoundHomePath } from "./workspace-not-found-route";

export type { WorkspaceShellRouteContentProps } from "./workspace-shell-route-content-types";

export function WorkspaceShellRouteContent(props: WorkspaceShellRouteContentProps) {
  const { navigate, route } = props;

  return (
    <>
      {route === "overview" ? <WorkspaceOverviewRouteContent {...props} /> : null}
      {route === "sources" ? <WorkspaceSourcesRouteContent {...props} /> : null}
      {route === "imports" ? <WorkspaceImportsRouteContent {...props} /> : null}
      {route === "audit" ? <SettingsAuditRouteContent {...props} /> : null}
      {route === "users" ? <SettingsUsersRouteContent {...props} /> : null}
      {route === "account" ? <SettingsAccountRouteContent {...props} /> : null}
      {route === "not-found" ? (
        <WorkspaceNotFoundRoute onNavigateHome={() => navigate(workspaceNotFoundHomePath)} />
      ) : null}
    </>
  );
}
