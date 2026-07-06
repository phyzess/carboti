export type StagedRecord = {
  id: string;
  importJobId: string;
  sourceFileId: string;
  stagedRecordKey: string;
  sourceRowKey: string;
  payload: unknown;
  reviewStatus: string;
  committedRecordId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ReviewIssue = {
  id: string;
  importJobId: string;
  stagedRecordKey: string;
  code: string;
  message: string;
  severity: string;
  status: string;
  createdAt: string;
};

export type AiAdvisoryArtifact = {
  id: string;
  kind: string;
  status: string;
  importJobId: string;
  provider: string;
  model: string;
  promptVersion: string;
  summary: string;
  output: unknown;
  createdAt: string;
  createdBy: string;
  confirmedBy: string | null;
  confirmedAt: string | null;
  dismissedBy: string | null;
  dismissedAt: string | null;
};
