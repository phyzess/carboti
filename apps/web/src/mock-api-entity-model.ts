import type { ApiUser, ImportJobListItem, SourceFile, StagedRecord } from "./types";

export const demoWorkspaceId = "default";

export function user(
  id: string,
  email: string,
  role: string,
  displayName: string,
  createdAt: string,
): ApiUser {
  return {
    createdAt,
    displayName,
    email,
    id,
    role,
  };
}

export function sourceFile(
  id: string,
  filename: string,
  objectKey: string,
  contentHash: string,
  size: number,
  uploadedBy: string,
  uploadedAt: string,
  contentType = "text/plain",
  workspaceId = demoWorkspaceId,
): SourceFile {
  return {
    contentHash,
    contentType,
    filename,
    id,
    objectKey,
    size,
    uploadedAt,
    uploadedBy,
    workspaceId,
  };
}

export function importJob(
  id: string,
  source: SourceFile,
  status: string,
  createdBy: string,
  createdAt: string,
  failure?: {
    failureClass: string;
    failureReason: string;
  },
): ImportJobListItem {
  return {
    adapterId: "starter-demo-adapter",
    attemptCount: failure ? 2 : 1,
    completedAt: status === "done" ? createdAt : null,
    createdAt,
    createdBy,
    failureClass: failure?.failureClass ?? null,
    failureReason: failure?.failureReason ?? null,
    id,
    jobKind: "import_review",
    processingStartedAt: createdAt,
    sourceFile: {
      contentType: source.contentType,
      filename: source.filename,
      workspaceId: source.workspaceId,
    },
    sourceFileId: source.id,
    status,
    updatedAt: createdAt,
  };
}

export function stagedRecord(
  job: ImportJobListItem,
  id: string,
  sourceRowKey: string,
  payload: unknown,
  reviewStatus: string,
): StagedRecord {
  return {
    committedRecordId: null,
    createdAt: job.createdAt,
    id,
    importJobId: job.id,
    payload,
    reviewStatus,
    sourceFileId: job.sourceFileId,
    sourceRowKey,
    stagedRecordKey: sourceRowKey,
    updatedAt: job.updatedAt,
  };
}
