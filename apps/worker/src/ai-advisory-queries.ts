export type AiAdvisoryArtifactRow = {
  id: string;
  import_job_id: string;
  kind: string;
  status: string;
  provider: string;
  model: string;
  prompt_version: string;
  summary: string;
  output_json: string;
  created_by: string;
  created_at: string;
  confirmed_by: string | null;
  confirmed_at: string | null;
  dismissed_by: string | null;
  dismissed_at: string | null;
};

const aiAdvisoryArtifactColumns = `
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
`;

export async function readAiAdvisoryArtifacts(
  env: Env,
  jobId: string,
): Promise<AiAdvisoryArtifactRow[]> {
  const result = await env.DB.prepare(
    `
      SELECT
${aiAdvisoryArtifactColumns}
      FROM ai_advisory_artifacts
      WHERE import_job_id = ?
      ORDER BY created_at DESC
    `,
  )
    .bind(jobId)
    .all<AiAdvisoryArtifactRow>();

  return result.results;
}

export async function readAiAdvisoryArtifact(
  env: Env,
  input: {
    advisoryId: string;
    importJobId: string;
  },
): Promise<AiAdvisoryArtifactRow | null> {
  return env.DB.prepare(
    `
      SELECT
${aiAdvisoryArtifactColumns}
      FROM ai_advisory_artifacts
      WHERE id = ? AND import_job_id = ?
      LIMIT 1
    `,
  )
    .bind(input.advisoryId, input.importJobId)
    .first<AiAdvisoryArtifactRow>();
}
