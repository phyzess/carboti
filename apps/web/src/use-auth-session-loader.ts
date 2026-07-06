import { useEffect } from "react";
import type { AppRoute } from "./app-routes";
import type { NoticeDescriptor } from "./app-notice";
import {
  errorMessage,
  loadSessionBootstrap,
  localDemoPassword,
  localDemoProfiles,
  type AuthFormState,
} from "./app-session";
import type { ApiUser } from "./types";
import { selectedJobDataNeededForRoute } from "./workspace-route-data";

export function useAuthSessionLoader(options: {
  loadWorkspace: (
    preferredJobId?: string,
    options?: {
      loadSelectedJobData?: boolean;
      updateReviewNotice?: boolean;
    },
  ) => Promise<void>;
  route: AppRoute;
  setAuthForm: (update: (current: AuthFormState) => AuthFormState) => void;
  setError: (message: string | null) => void;
  setIsLoadingSession: (loading: boolean) => void;
  setNotice: (notice: NoticeDescriptor) => void;
  setRuntimeEnvironment: (environment: string) => void;
  setUser: (user: ApiUser | null) => void;
}) {
  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      try {
        const session = await loadSessionBootstrap();
        if (cancelled) return;
        if (session.runtimeEnvironment) {
          options.setRuntimeEnvironment(session.runtimeEnvironment);
        }
        options.setUser(session.user);
        if (!session.user && session.runtimeEnvironment === "demo") {
          options.setAuthForm((current) => ({
            ...current,
            email: current.email || localDemoProfiles.admin.email,
            password: current.password || localDemoPassword,
          }));
        }
        if (session.user) {
          await options.loadWorkspace(undefined, {
            loadSelectedJobData: selectedJobDataNeededForRoute(options.route),
            updateReviewNotice: options.route === "reviews",
          });
          if (cancelled) return;
          options.setNotice({
            key:
              session.runtimeEnvironment === "demo"
                ? "notice.demoReady"
                : selectedJobDataNeededForRoute(options.route)
                  ? "notice.reviewQueueReady"
                  : "notice.workspaceReady",
          });
        }
      } catch (caught) {
        if (!cancelled) {
          options.setError(errorMessage(caught));
        }
      } finally {
        if (!cancelled) {
          options.setIsLoadingSession(false);
        }
      }
    }

    void loadSession();

    return () => {
      cancelled = true;
    };
  }, []);
}
