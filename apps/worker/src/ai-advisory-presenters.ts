import type { AiAdvisoryArtifactRow } from "./ai-advisory-queries";

export function publicAiAdvisoryArtifact(row: AiAdvisoryArtifactRow): Record<string, unknown> {
  return {
    id: row.id,
    kind: row.kind,
    status: row.status,
    importJobId: row.import_job_id,
    provider: row.provider,
    model: row.model,
    promptVersion: row.prompt_version,
    summary: row.summary,
    output: JSON.parse(row.output_json),
    createdAt: row.created_at,
    createdBy: row.created_by,
    confirmedBy: row.confirmed_by,
    confirmedAt: row.confirmed_at,
    dismissedBy: row.dismissed_by,
    dismissedAt: row.dismissed_at,
  };
}
