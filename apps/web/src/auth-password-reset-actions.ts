import type { Dispatch, FormEvent, SetStateAction } from "react";
import { confirmPasswordReset, requestPasswordReset } from "./api";
import { loginPath, type AppNavigationPath } from "./app-routes";
import type { AuthRoute } from "./auth-route";
import type { NoticeDescriptor } from "./app-notice";
import {
  passwordPolicyError,
  resetSessionBootstrap,
  type AuthFormState,
  type AuthMode,
} from "./app-session";
import type { Translate } from "./i18n";
import type { ApiUser } from "./types";

export type AuthPasswordResetActionsOptions = {
  authForm: AuthFormState;
  authRoute: AuthRoute;
  clearWorkspace: () => void;
  navigate: (path: AppNavigationPath, options?: { replace?: boolean }) => void;
  runAction: (action: () => Promise<void>) => Promise<void>;
  setAuthForm: Dispatch<SetStateAction<AuthFormState>>;
  setAuthMode: (mode: AuthMode) => void;
  setError: (message: string | null) => void;
  setNotice: (notice: NoticeDescriptor) => void;
  setUser: (user: ApiUser | null) => void;
  t: Translate;
};

export function createAuthPasswordResetActions(options: AuthPasswordResetActionsOptions) {
  async function handleRoutePasswordReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const authRoute = options.authRoute;
    if (authRoute.kind !== "reset") return;
    const policyError = passwordPolicyError(options.authForm.password, options.t);
    if (policyError) {
      options.setError(policyError);
      return;
    }

    await options.runAction(async () => {
      await confirmPasswordReset({
        token: authRoute.token,
        password: options.authForm.password,
      });
      resetSessionBootstrap();
      options.setUser(null);
      options.clearWorkspace();
      options.setAuthMode("login");
      options.setNotice({ key: "notice.passwordResetCompleteSignIn" });
      options.navigate(loginPath, { replace: true });
    });
  }

  async function handlePasswordReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await options.runAction(async () => {
      if (!options.authForm.resetToken) {
        const response = await requestPasswordReset({
          email: options.authForm.email,
        });
        options.setAuthForm((current) => ({
          ...current,
          resetToken: response.resetToken ?? current.resetToken,
        }));
        options.setNotice({
          key: response.resetToken
            ? "notice.localResetTokenCreated"
            : "notice.passwordResetEmailSent",
        });
        return;
      }

      const policyError = passwordPolicyError(options.authForm.password, options.t);
      if (policyError) {
        options.setError(policyError);
        return;
      }

      await confirmPasswordReset({
        token: options.authForm.resetToken,
        password: options.authForm.password,
      });
      resetSessionBootstrap();
      options.setAuthMode("login");
      options.setNotice({ key: "notice.passwordResetComplete" });
      options.navigate(loginPath, { replace: true });
    });
  }

  return {
    handlePasswordReset,
    handleRoutePasswordReset,
  };
}
