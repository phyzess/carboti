import { defaultAuthenticatedPath, type AppNavigationPath } from "./app-routes";
import type { NoticeDescriptor } from "./app-notice";
import { resetSessionBootstrap } from "./app-session";
import type { ApiUser } from "./types";

export type AuthenticatedSessionCompletionOptions = {
  loadWorkspace: (
    preferredJobId?: string,
    options?: {
      loadSelectedJobData?: boolean;
      updateReviewNotice?: boolean;
    },
  ) => Promise<void>;
  navigate: (path: AppNavigationPath, options?: { replace?: boolean }) => void;
  setNotice: (notice: NoticeDescriptor) => void;
  setUser: (user: ApiUser | null) => void;
};

export async function completeAuthenticatedSession(
  options: AuthenticatedSessionCompletionOptions,
  input: {
    notice: NoticeDescriptor;
    user: ApiUser;
  },
) {
  resetSessionBootstrap();
  options.setUser(input.user);
  options.setNotice(input.notice);
  await options.loadWorkspace();
  options.navigate(defaultAuthenticatedPath, { replace: true });
}
