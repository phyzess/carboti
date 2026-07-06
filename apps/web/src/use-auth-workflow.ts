import { useState } from "react";
import { type AppNavigationPath, type AppRoute } from "./app-routes";
import type { AuthRoute } from "./auth-route";
import type { NoticeDescriptor } from "./app-notice";
import type { Translate } from "./i18n";
import type { ApiUser } from "./types";
import { createAuthWorkflowActions } from "./auth-workflow-actions";
import { useAuthFormController } from "./use-auth-form-controller";
import { useAuthSessionLoader } from "./use-auth-session-loader";

type AuthWorkflowOptions = {
  authRoute: AuthRoute;
  clearWorkspace: () => void;
  loadWorkspace: (
    preferredJobId?: string,
    options?: {
      loadSelectedJobData?: boolean;
      updateReviewNotice?: boolean;
    },
  ) => Promise<void>;
  navigate: (path: AppNavigationPath, options?: { replace?: boolean }) => void;
  route: AppRoute;
  runAction: (action: () => Promise<void>) => Promise<void>;
  setError: (message: string | null) => void;
  setNotice: (notice: NoticeDescriptor) => void;
  t: Translate;
};

export function useAuthWorkflow(options: AuthWorkflowOptions) {
  const {
    authRoute,
    clearWorkspace,
    loadWorkspace,
    navigate,
    route,
    runAction,
    setError,
    setNotice,
    t,
  } = options;
  const [user, setUser] = useState<ApiUser | null>(null);
  const [runtimeEnvironment, setRuntimeEnvironment] = useState("unknown");
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const localSetupAvailable = runtimeEnvironment === "local";
  const {
    authForm,
    authMode,
    selectAuthMode,
    selectSetupRole,
    setAuthForm,
    setAuthMode,
    setupRole,
    updateAuthForm,
  } = useAuthFormController({ localSetupAvailable });

  useAuthSessionLoader({
    loadWorkspace,
    route,
    setAuthForm,
    setError,
    setIsLoadingSession,
    setNotice,
    setRuntimeEnvironment,
    setUser,
  });

  const authActions = createAuthWorkflowActions({
    authForm,
    authRoute,
    clearWorkspace,
    loadWorkspace,
    navigate,
    runAction,
    runtimeEnvironment,
    setAuthForm,
    setAuthMode,
    setError,
    setNotice,
    setUser,
    setupRole,
    t,
  });

  return {
    authForm,
    authMode,
    ...authActions,
    isLoadingSession,
    localSetupAvailable,
    runtimeEnvironment,
    selectAuthMode,
    selectSetupRole,
    setupRole,
    updateAuthForm,
    user,
  };
}
