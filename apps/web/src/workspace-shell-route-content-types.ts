import type { AuthenticatedWorkspaceProps } from "./authenticated-workspace-props";

export type WorkspaceShellRouteContentProps = Pick<
  AuthenticatedWorkspaceProps,
  | "audit"
  | "navigate"
  | "review"
  | "route"
  | "session"
  | "shell"
  | "upload"
  | "userManagement"
  | "workspace"
>;
