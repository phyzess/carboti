import type { StoredCommittedRecordRow } from "../import-review-store";

export async function readStarterCommittedRecords(
  env: Env,
  importJobId: string,
): Promise<StoredCommittedRecordRow[]> {
  const result = await env.DB.prepare(
    `
      SELECT
        id,
        import_job_id,
        source_file_id,
        staged_record_key,
        payload_json,
        committed_by,
        committed_at
      FROM example_committed_records
      WHERE import_job_id = ?
      ORDER BY committed_at ASC
    `,
  )
    .bind(importJobId)
    .all<StoredCommittedRecordRow>();

  return result.results;
}
