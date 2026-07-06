import type { FormEvent } from "react";
import {
  acceptInvitation,
  bootstrapLocalAdmin,
  bootstrapLocalReviewer,
  login,
  logout,
} from "./api";
import { loginPath } from "./app-routes";
import type { AuthRoute } from "./auth-route";
import {
  passwordPolicyError,
  resetSessionBootstrap,
  type AuthFormState,
  type LocalSetupRole,
} from "./app-session";
import {
  completeAuthenticatedSession,
  type AuthenticatedSessionCompletionOptions,
} from "./auth-session-completion";
import type { Translate } from "./i18n";

export type AuthSessionActionsOptions = AuthenticatedSessionCompletionOptions & {
  authForm: AuthFormState;
  authRoute: AuthRoute;
  clearWorkspace: () => void;
  runAction: (action: () => Promise<void>) => Promise<void>;
  runtimeEnvironment: string;
  setError: (message: string | null) => void;
  setupRole: LocalSetupRole;
  t: Translate;
};

export function createAuthSessionActions(options: AuthSessionActionsOptions) {
  async function handleLocalSetup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const policyError = passwordPolicyError(options.authForm.password, options.t);
    if (policyError) {
      options.setError(policyError);
      return;
    }

    await options.runAction(async () => {
      const bootstrapDemoUser =
        options.setupRole === "admin" ? bootstrapLocalAdmin : bootstrapLocalReviewer;
      const response = await bootstrapDemoUser({
        email: options.authForm.email,
        password: options.authForm.password,
        ...(options.authForm.displayName ? { displayName: options.authForm.displayName } : {}),
      });
      await completeAuthenticatedSession(options, {
        user: response.user,
        notice: {
          key:
            options.setupRole === "admin"
              ? response.created
                ? "notice.localDemoAdminCreated"
                : "notice.localDemoAdminReset"
              : response.created
                ? "notice.localDemoReviewerCreated"
                : "notice.localDemoReviewerReset",
        },
      });
    });
  }

  async function handleInviteAccept(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const authRoute = options.authRoute;
    if (authRoute.kind !== "invite") return;
    const policyError = passwordPolicyError(options.authForm.password, options.t);
    if (policyError) {
      options.setError(policyError);
      return;
    }

    await options.runAction(async () => {
      const accepted = await acceptInvitation({
        token: authRoute.token,
        password: options.authForm.password,
        ...(options.authForm.displayName ? { displayName: options.authForm.displayName } : {}),
      });
      await completeAuthenticatedSession(options, {
        user: accepted.user,
        notice: { key: "notice.invitationAccepted" },
      });
    });
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await options.runAction(async () => {
      const response = await login({
        email: options.authForm.email,
        password: options.authForm.password,
      });
      await completeAuthenticatedSession(options, {
        user: response.user,
        notice: {
          key: options.runtimeEnvironment === "demo" ? "notice.demoReady" : "notice.signedIn",
        },
      });
    });
  }

  async function handleLogout() {
    await options.runAction(async () => {
      await logout();
      resetSessionBootstrap();
      options.setUser(null);
      options.clearWorkspace();
      options.setNotice({ key: "notice.signedOut" });
      options.navigate(loginPath, { replace: true });
    });
  }

  return {
    handleInviteAccept,
    handleLocalSetup,
    handleLogin,
    handleLogout,
  };
}
