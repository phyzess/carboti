export type ImportJobEventRow = {
  id: string;
  import_job_id: string;
  source_file_id: string | null;
  event_type: string;
  status_from: string | null;
  status_to: string | null;
  actor_user_id: string | null;
  message: string | null;
  metadata_json: string | null;
  request_id: string | null;
  created_at: string;
};

export async function readImportJobEvents(
  env: Env,
  input: { importJobId: string; limit: number },
): Promise<ImportJobEventRow[]> {
  const result = await env.DB.prepare(
    `
      SELECT
        id,
        import_job_id,
        source_file_id,
        event_type,
        status_from,
        status_to,
        actor_user_id,
        message,
        metadata_json,
        request_id,
        created_at
      FROM import_job_events
      WHERE import_job_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `,
  )
    .bind(input.importJobId, input.limit)
    .all<ImportJobEventRow>();

  return result.results;
}
