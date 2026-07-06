import type {
  ImportJobStatus,
  ReviewDecisionAction,
  ReviewIssueSeverity,
  ReviewRecordDecisionAction,
  StagedRecordStatus,
} from "./schemas";

export type ImportJob = {
  id: string;
  sourceFileId: string;
  status: ImportJobStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type StagedRecord<TPayload> = {
  id: string;
  importJobId: string;
  stagedRecordKey: string;
  status: StagedRecordStatus;
  payload: TPayload;
  issues: ReviewIssue[];
};

export type ReviewIssue = {
  code: string;
  message: string;
  severity: ReviewIssueSeverity;
};

export type CommitApprovedContext = {
  importJobId: string;
  reviewerId: string;
  approvedStagedRecordKeys: string[];
  idempotencyKey: string;
};

export type ImportFeatureAdapter<TParsed, TStaged, TCommitted> = {
  id: string;
  canHandle(source: { filename: string; contentType: string }): boolean;
  parse(source: ReadableStream<Uint8Array>): Promise<TParsed[]>;
  stage(parsed: TParsed[]): Promise<TStaged[]>;
  validate(staged: TStaged): ReviewIssue[];
  commitApproved(input: {
    records: TStaged[];
    context: CommitApprovedContext;
  }): Promise<TCommitted[]>;
};

export type ReviewDecision = {
  importJobId: string;
  reviewerId: string;
  action: ReviewDecisionAction;
  note?: string;
  rowDecisions?: Array<{
    stagedRecordId: string;
    action: ReviewRecordDecisionAction;
    note?: string;
  }>;
};

export type ReviewStatusSummary = Record<StagedRecordStatus, number>;
