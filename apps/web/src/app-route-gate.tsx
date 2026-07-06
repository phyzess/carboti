import type { FormEventHandler, ReactNode } from "react";
import type { AppRoute } from "./app-routes";
import { isProtectedRoute } from "./app-routes";
import {
  AuthLoadingPage,
  GuestAuthPage,
  InviteAcceptPage,
  RoutePasswordResetPage,
} from "./app-auth-pages";
import type { AuthFormState, AuthMode, LocalSetupRole } from "./app-session";
import type { AuthRoute } from "./auth-route";
import type { ApiUser } from "./types";
import { ProtectedWorkspaceLoading } from "./workspace-loading-shell";

export type AppRouteGateProps = {
  authForm: AuthFormState;
  authMode: AuthMode;
  authRoute: AuthRoute;
  error: string | null;
  isBusy: boolean;
  isLoadingSession: boolean;
  localSetupAvailable: boolean;
  noticeText: string;
  route: AppRoute;
  setupRole: LocalSetupRole;
  user: ApiUser | null;
  onAuthFormChange: (patch: Partial<AuthFormState>) => void;
  onAuthModeChange: (mode: AuthMode) => void;
  onInviteAccept: FormEventHandler<HTMLFormElement>;
  onLocalSetup: FormEventHandler<HTMLFormElement>;
  onLogin: FormEventHandler<HTMLFormElement>;
  onPasswordReset: FormEventHandler<HTMLFormElement>;
  onRoutePasswordReset: FormEventHandler<HTMLFormElement>;
  onSetupRoleChange: (role: LocalSetupRole) => void;
};

export function renderAppRouteGate(props: AppRouteGateProps): ReactNode | null {
  if (
    props.authRoute.kind === "home" &&
    isProtectedRoute(props.route) &&
    (props.isLoadingSession || !props.user)
  ) {
    return <ProtectedWorkspaceLoading notice={props.noticeText} route={props.route} />;
  }

  if (props.isLoadingSession) {
    return <AuthLoadingPage notice={props.noticeText} />;
  }

  if (props.authRoute.kind === "invite") {
    return (
      <InviteAcceptPage
        authForm={props.authForm}
        error={props.error}
        isBusy={props.isBusy}
        notice={props.noticeText}
        onAuthFormChange={props.onAuthFormChange}
        onSubmit={props.onInviteAccept}
      />
    );
  }

  if (props.authRoute.kind === "reset") {
    return (
      <RoutePasswordResetPage
        authForm={props.authForm}
        error={props.error}
        isBusy={props.isBusy}
        notice={props.noticeText}
        onAuthFormChange={props.onAuthFormChange}
        onSubmit={props.onRoutePasswordReset}
      />
    );
  }

  if (!props.user) {
    return (
      <GuestAuthPage
        authForm={props.authForm}
        authMode={props.authMode}
        error={props.error}
        isBusy={props.isBusy}
        localSetupAvailable={props.localSetupAvailable}
        notice={props.noticeText}
        setupRole={props.setupRole}
        onAuthFormChange={props.onAuthFormChange}
        onAuthModeChange={props.onAuthModeChange}
        onSetupRoleChange={props.onSetupRoleChange}
        onSubmit={
          props.authMode === "setup" && props.localSetupAvailable
            ? props.onLocalSetup
            : props.authMode === "reset"
              ? props.onPasswordReset
              : props.onLogin
        }
      />
    );
  }

  return null;
}
