import { ReviewConsole } from "./review-console";
import {
  buildReviewConsoleProps,
  type ReviewWorkspaceRouteProps,
} from "./review-workspace-route-props";

export function ReviewWorkspaceRoute(props: ReviewWorkspaceRouteProps) {
  return (
    <>
      <ReviewConsole {...buildReviewConsoleProps(props)} />
      {props.shell.overlays}
    </>
  );
}
