import type { ReviewStatusSummary } from "@carboti/import-pipeline";

export type StoredStagedRecordRow = {
  id: string;
  import_job_id: string;
  source_file_id: string;
  staged_record_key: string;
  source_row_key: string;
  payload_json: string;
  review_status: string;
  committed_record_id: string | null;
  created_at: string;
  updated_at: string;
};

export type StoredCommittedRecordRow = {
  id: string;
  import_job_id: string;
  source_file_id: string;
  staged_record_key: string;
  payload_json: string;
  committed_by: string;
  committed_at: string;
};

export type StageRecordInput = {
  id: string;
  importJobId: string;
  sourceFileId: string;
  stagedRecordKey: string;
  sourceRowKey: string;
  payloadJson: string;
  reviewStatus: string;
  createdAt: string;
  updatedAt: string;
};

export type CommitRecordInput = {
  id: string;
  record: StoredStagedRecordRow;
  payloadJson: string;
  committedBy: string;
  committedAt: string;
};

export type WorkerReviewStore = {
  stagedRecordSubjectKind: string;
  readStagedRecordByKey(
    env: Env,
    input: { importJobId: string; stagedRecordKey: string },
  ): Promise<{ id: string } | null>;
  readStagedRecords(env: Env, importJobId: string): Promise<StoredStagedRecordRow[]>;
  readStagedRecord(
    env: Env,
    input: { id: string; importJobId: string },
  ): Promise<StoredStagedRecordRow | null>;
  readPendingStagedRecords(env: Env, importJobId: string): Promise<StoredStagedRecordRow[]>;
  readApprovedStagedRecords(env: Env, importJobId: string): Promise<StoredStagedRecordRow[]>;
  readCommittedRecords(env: Env, importJobId: string): Promise<StoredCommittedRecordRow[]>;
  readReviewStatusSummary(env: Env, importJobId: string): Promise<ReviewStatusSummary>;
  prepareInsertStagedRecord(env: Env, input: StageRecordInput): D1PreparedStatement;
  prepareUpdateStagedRecordStatus(
    env: Env,
    input: { id: string; reviewStatus: string; updatedAt: string; onlyPending?: boolean },
  ): D1PreparedStatement;
  prepareInsertCommittedRecord(env: Env, input: CommitRecordInput): D1PreparedStatement;
  prepareMarkStagedRecordCommitted(
    env: Env,
    input: { id: string; committedRecordId: string; updatedAt: string },
  ): D1PreparedStatement;
};
