import type { StoredCommittedRecordRow, StoredStagedRecordRow } from "./import-review-store";

export type CommittedRecordPair = {
  committedRecord: StoredCommittedRecordRow;
  record: StoredStagedRecordRow;
};
