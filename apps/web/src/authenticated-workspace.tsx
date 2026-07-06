import type { AuthenticatedWorkspaceProps } from "./authenticated-workspace-props";
import { ReviewWorkspaceRoute } from "./review-workspace-route";
import { WorkspaceShellRoutes } from "./workspace-shell-routes";

export function AuthenticatedWorkspace(props: AuthenticatedWorkspaceProps) {
  if (props.route === "reviews") {
    return (
      <ReviewWorkspaceRoute
        review={props.review}
        session={props.session}
        shell={props.shell}
        upload={props.upload}
        workspace={props.workspace}
      />
    );
  }

  return <WorkspaceShellRoutes {...props} />;
}
