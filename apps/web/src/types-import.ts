export type ImportJobListItem = {
  id: string;
  sourceFileId: string;
  status: string;
  jobKind: string | null;
  adapterId: string | null;
  attemptCount: number;
  failureReason: string | null;
  failureClass: string | null;
  processingStartedAt: string | null;
  completedAt: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  sourceFile: {
    filename: string;
    contentType: string;
    workspaceId: string;
  };
};

export type ImportJobReview = {
  id: string;
  sourceFileId: string;
  status: string;
  jobKind: string | null;
  adapterId: string | null;
  failureReason: string | null;
  failureClass: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  sourceFile: {
    filename: string;
    contentType: string;
    objectKey: string;
  };
};

export type ImportJobEvent = {
  id: string;
  importJobId: string;
  sourceFileId: string | null;
  eventType: string;
  statusFrom: string | null;
  statusTo: string | null;
  actorUserId: string | null;
  message: string | null;
  metadata: unknown;
  requestId: string | null;
  createdAt: string;
};
