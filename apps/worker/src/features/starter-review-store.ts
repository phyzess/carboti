import type { WorkerReviewStore } from "../import-review-store";
import {
  readStarterApprovedStagedRecords,
  readStarterCommittedRecords,
  readStarterPendingStagedRecords,
  readStarterReviewStatusSummary,
  readStarterStagedRecord,
  readStarterStagedRecordByKey,
  readStarterStagedRecords,
} from "./starter-review-queries";
import {
  prepareInsertStarterCommittedRecord,
  prepareInsertStarterStagedRecord,
  prepareMarkStarterStagedRecordCommitted,
  prepareUpdateStarterStagedRecordStatus,
} from "./starter-review-statements";

export const starterReviewStore: WorkerReviewStore = {
  stagedRecordSubjectKind: "example_staged_record",
  readStagedRecordByKey: readStarterStagedRecordByKey,
  readStagedRecords: readStarterStagedRecords,
  readStagedRecord: readStarterStagedRecord,
  readPendingStagedRecords: readStarterPendingStagedRecords,
  readApprovedStagedRecords: readStarterApprovedStagedRecords,
  readCommittedRecords: readStarterCommittedRecords,
  readReviewStatusSummary: readStarterReviewStatusSummary,
  prepareInsertStagedRecord: prepareInsertStarterStagedRecord,
  prepareUpdateStagedRecordStatus: prepareUpdateStarterStagedRecordStatus,
  prepareInsertCommittedRecord: prepareInsertStarterCommittedRecord,
  prepareMarkStagedRecordCommitted: prepareMarkStarterStagedRecordCommitted,
};
