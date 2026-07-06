import { assert } from "./worker-integration-http.mjs";

export async function assertInboundEmailIntake(env) {
  assert(env.IMPORT_JOBS.messages.length === 2, "inbound email attachments queue import jobs");
  const inboundEmail = await env.DB.prepare(
    "SELECT id, raw_object_key, attachment_count, status FROM inbound_email_messages LIMIT 1",
  ).first();
  assert(inboundEmail?.attachment_count === 2, "inbound email stores receipt metadata");
  assert(inboundEmail.status === "queued", "inbound email receipt reflects queued attachment");
  assert(
    env.SOURCE_FILES.has(inboundEmail.raw_object_key),
    "inbound email stores raw RFC822 in R2",
  );

  const attachments = await env.DB.prepare(
    "SELECT source_file_id, import_job_id, object_key, status FROM inbound_email_attachments",
  ).all();
  assert(
    attachments.results.every(
      (attachment) =>
        attachment.source_file_id && attachment.import_job_id && attachment.status === "queued",
    ),
    "inbound attachments link to source files and import jobs",
  );

  const sources = await env.DB.prepare(
    "SELECT filename, uploaded_by FROM source_files ORDER BY filename ASC",
  ).all();
  assert(
    sources.results.map((source) => source.filename).join(",") ===
      "inbound-source.txt,nested-source.txt",
    "inbound attachments create source files from top-level and nested MIME parts",
  );
  assert(
    sources.results.every((source) => source.uploaded_by === "system:inbound-email"),
    "inbound source files record system actor",
  );
}
