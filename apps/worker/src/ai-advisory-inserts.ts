import type { AdvisoryArtifact } from "@carboti/ai-advisory";

export function prepareAiAdvisoryInsert(env: Env, artifact: AdvisoryArtifact): D1PreparedStatement {
  return env.DB.prepare(
    `
      INSERT INTO ai_advisory_artifacts (
        id,
        import_job_id,
        kind,
        status,
        provider,
        model,
        prompt_version,
        summary,
        output_json,
        created_by,
        created_at,
        confirmed_by,
        confirmed_at,
        dismissed_by,
        dismissed_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
  ).bind(
    artifact.id,
    artifact.importJobId,
    artifact.kind,
    artifact.status,
    artifact.provider,
    artifact.model,
    artifact.promptVersion,
    artifact.summary,
    JSON.stringify(artifact.output),
    artifact.createdBy,
    artifact.createdAt,
    artifact.confirmedBy ?? null,
    artifact.confirmedAt ?? null,
    artifact.dismissedBy ?? null,
    artifact.dismissedAt ?? null,
  );
}
