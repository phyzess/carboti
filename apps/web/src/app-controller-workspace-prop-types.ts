import type { AppNavigationPath, AppRoute } from "./app-routes";
import type { ApiUser } from "./types";
import type { useAppActionRunner, useWorkspaceActions } from "./use-app-actions";
import type { useAuthWorkflow } from "./use-auth-workflow";
import type { useReviewActions } from "./use-review-actions";
import type { useUploadController } from "./use-upload-controller";
import type { useUserManagement } from "./use-user-management";
import type { useWorkspaceData } from "./use-workspace-data";
import type { useWorkspaceShellController } from "./use-workspace-shell-controller";
import type { useWorkspaceViewModel } from "./use-workspace-view-model";
import type { WebPermissions } from "./web-permissions";

type AppActionRunnerState = Pick<ReturnType<typeof useAppActionRunner>, "error" | "isBusy">;
type AuthWorkflowSession = Pick<
  ReturnType<typeof useAuthWorkflow>,
  "handleLogout" | "runtimeEnvironment"
>;
type Navigate = (path: AppNavigationPath, options?: { replace?: boolean }) => void;

export type BuildAuthenticatedWorkspacePropsOptions = {
  actionRunner: AppActionRunnerState;
  authSession: AuthWorkflowSession;
  navigate: Navigate;
  noticeText: string;
  permissions: WebPermissions;
  reviewActions: ReturnType<typeof useReviewActions>;
  route: AppRoute;
  shellController: ReturnType<typeof useWorkspaceShellController>;
  uploadController: ReturnType<typeof useUploadController>;
  user: ApiUser;
  userManagement: ReturnType<typeof useUserManagement>;
  viewModel: ReturnType<typeof useWorkspaceViewModel>;
  workspaceActions: ReturnType<typeof useWorkspaceActions>;
  workspaceData: ReturnType<typeof useWorkspaceData>;
};
