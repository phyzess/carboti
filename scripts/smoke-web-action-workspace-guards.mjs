export function assertWebWorkspaceActionWorkflowGuards(context) {
  const {
    assert,
    webAppControllerWorkspacePropSections,
    webAppControllerWorkspaceProps,
    webPermissions,
    webUploadController,
    webUploadQueueActions,
    webUploadQueueBatch,
    webUploadQueueState,
    webUserManagement,
    webUserManagementActions,
    webWorkspaceData,
    webWorkspaceReviewData,
  } = context;

  assert(
    webAppControllerWorkspaceProps.includes("buildAuthenticatedWorkspaceSessionProps") &&
      webAppControllerWorkspaceProps.includes("buildAuthenticatedWorkspaceUserManagementProps") &&
      webAppControllerWorkspacePropSections.includes("buildAuthenticatedWorkspaceSessionProps") &&
      webAppControllerWorkspacePropSections.includes(
        "buildAuthenticatedWorkspaceUserManagementProps",
      ) &&
      webUserManagement.includes("createUserManagementActions") &&
      webUserManagementActions.includes("function createUserManagementActions") &&
      webUserManagementActions.includes("createInvitation") &&
      webUserManagementActions.includes("deleteUser") &&
      !webUserManagement.includes("createInvitation") &&
      !webUserManagement.includes("deleteUser") &&
      !webUserManagement.includes("async function runUserManagementAction") &&
      webUploadController.includes("createUploadQueueActions") &&
      webUploadQueueActions.includes("function createUploadQueueActions") &&
      webUploadQueueActions.includes("runUploadQueueBatch") &&
      webUploadQueueBatch.includes("function runUploadQueueBatch") &&
      webUploadQueueBatch.includes("uploadSourceFile") &&
      webUploadQueueBatch.includes("completedEntryIds") &&
      !webUploadQueueActions.includes("uploadSourceFile") &&
      !webUploadQueueActions.includes("completedEntryIds") &&
      !webUploadController.includes("uploadSourceFile") &&
      !webUploadController.includes("completedEntryIds") &&
      !webUploadController.includes("async function uploadQueueEntries") &&
      webWorkspaceData.includes("useWorkspaceReviewData") &&
      webWorkspaceReviewData.includes("function useWorkspaceReviewData") &&
      webWorkspaceReviewData.includes("Promise.allSettled") &&
      !webWorkspaceData.includes("getImportJobReview") &&
      !webWorkspaceData.includes("listAiAdvisories") &&
      !webWorkspaceData.includes("listImportJobEvents") &&
      webUploadQueueState.includes("createUploadQueueEntries") &&
      webPermissions.includes("buildWebPermissions"),
    "web user-management, upload, workspace-data, and permission modules must stay split.",
  );
}
