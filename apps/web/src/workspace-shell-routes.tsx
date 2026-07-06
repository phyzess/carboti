import { WorkspaceShell } from "./app-workspace-shell";
import {
  WorkspaceShellRouteContent,
  type WorkspaceShellRouteContentProps,
} from "./workspace-shell-route-content";

type WorkspaceShellRoutesProps = WorkspaceShellRouteContentProps;

export function WorkspaceShellRoutes(props: WorkspaceShellRoutesProps) {
  const { session, shell } = props;

  return (
    <>
      <WorkspaceShell
        actions={shell.actions}
        error={session.error}
        navigation={shell.navigationModel.primaryNavigation}
        notice={session.noticeText}
        subNavigation={shell.navigationModel.subNavigation}
        onCommand={shell.onCommand}
      >
        <WorkspaceShellRouteContent {...props} />
      </WorkspaceShell>
      {shell.overlays}
    </>
  );
}
