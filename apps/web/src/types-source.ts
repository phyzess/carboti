export type SourceFile = {
  id: string;
  workspaceId: string;
  objectKey: string;
  filename: string;
  contentType: string;
  contentHash: string | null;
  size: number | null;
  uploadedBy: string;
  uploadedAt: string;
};

export type UploadQueueStatus = "queued" | "uploading" | "uploaded" | "duplicate" | "failed";

export type UploadQueueEntry = {
  error?: string | undefined;
  file: File;
  id: string;
  importJobId?: string | undefined;
  status: UploadQueueStatus;
};
