export function assertWebAuthActionWorkflowGuards(context) {
  const {
    assert,
    webApp,
    webAppActions,
    webAppController,
    webAuthenticatedWorkspaceProps,
    webAuthPasswordResetActions,
    webAuthSessionActions,
    webAuthSessionCompletion,
    webAuthWorkflow,
    webAuthWorkflowActions,
  } = context;

  assert(
    webAuthenticatedWorkspaceProps.includes("type AuthenticatedWorkspaceSession") &&
      webAuthenticatedWorkspaceProps.includes("type AuthenticatedWorkspaceReview") &&
      webApp.includes("useAppController") &&
      webAppController.includes("buildAuthenticatedWorkspaceProps") &&
      !webAppController.includes("session: {") &&
      webAppActions.includes("useAppActionRunner") &&
      webAppActions.includes("useWorkspaceActions") &&
      webAuthWorkflow.includes("createAuthWorkflowActions") &&
      webAuthWorkflowActions.includes("function createAuthWorkflowActions") &&
      webAuthWorkflowActions.includes("createAuthSessionActions") &&
      webAuthWorkflowActions.includes("createAuthPasswordResetActions") &&
      webAuthSessionActions.includes("function createAuthSessionActions") &&
      webAuthSessionActions.includes("completeAuthenticatedSession") &&
      webAuthSessionActions.includes("bootstrapLocalAdmin") &&
      webAuthSessionCompletion.includes("function completeAuthenticatedSession") &&
      webAuthSessionCompletion.includes("resetSessionBootstrap") &&
      webAuthSessionCompletion.includes("defaultAuthenticatedPath") &&
      webAuthPasswordResetActions.includes("function createAuthPasswordResetActions") &&
      webAuthPasswordResetActions.includes("confirmPasswordReset") &&
      !webAuthWorkflow.includes("bootstrapLocalAdmin") &&
      !webAuthWorkflow.includes("confirmPasswordReset") &&
      !webAuthWorkflow.includes("async function handleLogin") &&
      !webAuthWorkflowActions.includes("bootstrapLocalAdmin") &&
      !webAuthWorkflowActions.includes("confirmPasswordReset"),
    "web auth action modules must stay split from top-level auth workflow wiring.",
  );
}
