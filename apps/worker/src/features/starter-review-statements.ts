import type { CommitRecordInput, StageRecordInput } from "../import-review-store";

export function prepareInsertStarterStagedRecord(
  env: Env,
  input: StageRecordInput,
): D1PreparedStatement {
  return env.DB.prepare(
    `
      INSERT OR IGNORE INTO example_staged_records (
        id,
        import_job_id,
        source_file_id,
        staged_record_key,
        source_row_key,
        payload_json,
        review_status,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
  ).bind(
    input.id,
    input.importJobId,
    input.sourceFileId,
    input.stagedRecordKey,
    input.sourceRowKey,
    input.payloadJson,
    input.reviewStatus,
    input.createdAt,
    input.updatedAt,
  );
}

export function prepareUpdateStarterStagedRecordStatus(
  env: Env,
  input: { id: string; reviewStatus: string; updatedAt: string; onlyPending?: boolean },
): D1PreparedStatement {
  const sql = input.onlyPending
    ? `
      UPDATE example_staged_records
      SET review_status = ?, updated_at = ?
      WHERE id = ? AND review_status = 'pending'
    `
    : `
      UPDATE example_staged_records
      SET review_status = ?, updated_at = ?
      WHERE id = ?
    `;

  return env.DB.prepare(sql).bind(input.reviewStatus, input.updatedAt, input.id);
}

export function prepareInsertStarterCommittedRecord(
  env: Env,
  input: CommitRecordInput,
): D1PreparedStatement {
  return env.DB.prepare(
    `
      INSERT INTO example_committed_records (
        id,
        import_job_id,
        source_file_id,
        staged_record_key,
        payload_json,
        committed_by,
        committed_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
  ).bind(
    input.id,
    input.record.import_job_id,
    input.record.source_file_id,
    input.record.staged_record_key,
    input.payloadJson,
    input.committedBy,
    input.committedAt,
  );
}

export function prepareMarkStarterStagedRecordCommitted(
  env: Env,
  input: { id: string; committedRecordId: string; updatedAt: string },
): D1PreparedStatement {
  return env.DB.prepare(
    `
      UPDATE example_staged_records
      SET review_status = 'committed', committed_record_id = ?, updated_at = ?
      WHERE id = ? AND review_status = 'approved' AND committed_record_id IS NULL
    `,
  ).bind(input.committedRecordId, input.updatedAt, input.id);
}
