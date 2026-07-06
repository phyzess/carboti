import type { AuthenticatedWorkspaceProps } from "./authenticated-workspace-props";
import {
  buildAuthenticatedWorkspaceAuditProps,
  buildAuthenticatedWorkspaceDataProps,
  buildAuthenticatedWorkspaceReviewProps,
  buildAuthenticatedWorkspaceSessionProps,
  buildAuthenticatedWorkspaceShellProps,
  buildAuthenticatedWorkspaceUploadProps,
  buildAuthenticatedWorkspaceUserManagementProps,
} from "./app-controller-workspace-prop-sections";
import type { BuildAuthenticatedWorkspacePropsOptions } from "./app-controller-workspace-prop-types";

export type { BuildAuthenticatedWorkspacePropsOptions } from "./app-controller-workspace-prop-types";

export function buildAuthenticatedWorkspaceProps(
  options: BuildAuthenticatedWorkspacePropsOptions,
): AuthenticatedWorkspaceProps {
  const { navigate, route } = options;

  return {
    audit: buildAuthenticatedWorkspaceAuditProps(options),
    navigate,
    review: buildAuthenticatedWorkspaceReviewProps(options),
    route,
    session: buildAuthenticatedWorkspaceSessionProps(options),
    shell: buildAuthenticatedWorkspaceShellProps(options),
    upload: buildAuthenticatedWorkspaceUploadProps(options),
    userManagement: buildAuthenticatedWorkspaceUserManagementProps(options),
    workspace: buildAuthenticatedWorkspaceDataProps(options),
  };
}
