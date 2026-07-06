import type { StoredStagedRecordRow } from "../import-review-store";
import { starterStagedRecordSelect } from "./starter-review-staged-row-select";

export async function readStarterStagedRecordByKey(
  env: Env,
  input: { importJobId: string; stagedRecordKey: string },
): Promise<{ id: string } | null> {
  return env.DB.prepare(
    `
      SELECT id
      FROM example_staged_records
      WHERE import_job_id = ? AND staged_record_key = ?
      LIMIT 1
    `,
  )
    .bind(input.importJobId, input.stagedRecordKey)
    .first<{ id: string }>();
}

export async function readStarterStagedRecords(
  env: Env,
  importJobId: string,
): Promise<StoredStagedRecordRow[]> {
  const result = await env.DB.prepare(
    `
      ${starterStagedRecordSelect}
      WHERE import_job_id = ?
      ORDER BY created_at ASC
    `,
  )
    .bind(importJobId)
    .all<StoredStagedRecordRow>();

  return result.results;
}

export async function readStarterStagedRecord(
  env: Env,
  input: { id: string; importJobId: string },
): Promise<StoredStagedRecordRow | null> {
  return env.DB.prepare(
    `
      ${starterStagedRecordSelect}
      WHERE id = ? AND import_job_id = ?
      LIMIT 1
    `,
  )
    .bind(input.id, input.importJobId)
    .first<StoredStagedRecordRow>();
}

export async function readStarterPendingStagedRecords(
  env: Env,
  importJobId: string,
): Promise<StoredStagedRecordRow[]> {
  return readStarterStagedRecordsByStatus(env, importJobId, "pending");
}

export async function readStarterApprovedStagedRecords(
  env: Env,
  importJobId: string,
): Promise<StoredStagedRecordRow[]> {
  const result = await env.DB.prepare(
    `
      ${starterStagedRecordSelect}
      WHERE import_job_id = ?
        AND review_status = 'approved'
        AND committed_record_id IS NULL
      ORDER BY created_at ASC
    `,
  )
    .bind(importJobId)
    .all<StoredStagedRecordRow>();

  return result.results;
}

async function readStarterStagedRecordsByStatus(
  env: Env,
  importJobId: string,
  status: string,
): Promise<StoredStagedRecordRow[]> {
  const result = await env.DB.prepare(
    `
      ${starterStagedRecordSelect}
      WHERE import_job_id = ?
        AND review_status = ?
      ORDER BY created_at ASC
    `,
  )
    .bind(importJobId, status)
    .all<StoredStagedRecordRow>();

  return result.results;
}
