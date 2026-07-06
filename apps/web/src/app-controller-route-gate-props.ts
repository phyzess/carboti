import type { AppRoute } from "./app-routes";
import type { AppRouteGateProps } from "./app-route-gate";
import type { AuthRoute } from "./auth-route";
import type { useAppActionRunner } from "./use-app-actions";
import type { useAuthWorkflow } from "./use-auth-workflow";

type AppActionRunnerRouteGateState = Pick<
  ReturnType<typeof useAppActionRunner>,
  "error" | "isBusy"
>;
type AuthWorkflowRouteGateState = Pick<
  ReturnType<typeof useAuthWorkflow>,
  | "authForm"
  | "authMode"
  | "handleInviteAccept"
  | "handleLocalSetup"
  | "handleLogin"
  | "handlePasswordReset"
  | "handleRoutePasswordReset"
  | "isLoadingSession"
  | "localSetupAvailable"
  | "selectAuthMode"
  | "selectSetupRole"
  | "setupRole"
  | "updateAuthForm"
  | "user"
>;

export type BuildAppRouteGatePropsOptions = {
  actionRunner: AppActionRunnerRouteGateState;
  authRoute: AuthRoute;
  authWorkflow: AuthWorkflowRouteGateState;
  noticeText: string;
  route: AppRoute;
};

export function buildAppRouteGateProps({
  actionRunner,
  authRoute,
  authWorkflow,
  noticeText,
  route,
}: BuildAppRouteGatePropsOptions): AppRouteGateProps {
  return {
    authForm: authWorkflow.authForm,
    authMode: authWorkflow.authMode,
    authRoute,
    error: actionRunner.error,
    isBusy: actionRunner.isBusy,
    isLoadingSession: authWorkflow.isLoadingSession,
    localSetupAvailable: authWorkflow.localSetupAvailable,
    noticeText,
    route,
    setupRole: authWorkflow.setupRole,
    user: authWorkflow.user,
    onAuthFormChange: authWorkflow.updateAuthForm,
    onAuthModeChange: authWorkflow.selectAuthMode,
    onInviteAccept: authWorkflow.handleInviteAccept,
    onLocalSetup: authWorkflow.handleLocalSetup,
    onLogin: authWorkflow.handleLogin,
    onPasswordReset: authWorkflow.handlePasswordReset,
    onRoutePasswordReset: authWorkflow.handleRoutePasswordReset,
    onSetupRoleChange: authWorkflow.selectSetupRole,
  };
}
