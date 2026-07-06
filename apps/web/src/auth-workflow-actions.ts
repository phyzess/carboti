import {
  createAuthPasswordResetActions,
  type AuthPasswordResetActionsOptions,
} from "./auth-password-reset-actions";
import { createAuthSessionActions, type AuthSessionActionsOptions } from "./auth-session-actions";

type AuthWorkflowActionsOptions = AuthPasswordResetActionsOptions & AuthSessionActionsOptions;

export function createAuthWorkflowActions(options: AuthWorkflowActionsOptions) {
  const passwordResetActions = createAuthPasswordResetActions(options);
  const sessionActions = createAuthSessionActions(options);

  return {
    ...passwordResetActions,
    ...sessionActions,
  };
}
