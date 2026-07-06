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

  const rawAttachmentObjects = await env.DB.prepare(
    "SELECT object_key FROM carboti_objects WHERE kind = 'raw_attachment' ORDER BY object_key ASC",
  ).all();
  assert(
    rawAttachmentObjects.results.length === 2 &&
      rawAttachmentObjects.results.every((object) => env.SOURCE_FILES.has(object.object_key)),
    "inbound attachments are preserved as raw Carboti R2 objects",
  );

  const objectCounts = await env.DB.prepare(
    "SELECT kind, COUNT(*) AS count FROM carboti_objects GROUP BY kind",
  ).all();
  const objectCountByKind = Object.fromEntries(
    objectCounts.results.map((row) => [row.kind, row.count]),
  );
  assert(objectCountByKind.raw_email === 1, "Carboti stores raw email object metadata");
  assert(objectCountByKind.raw_attachment === 2, "Carboti stores raw attachment object metadata");
  assert(
    objectCountByKind.normalized_message === 1,
    "Carboti stores normalized message object metadata",
  );
  assert(objectCountByKind.artifact === 3, "Carboti stores artifact object metadata");

  const artifacts = await env.DB.prepare(
    "SELECT kind, data_json FROM carboti_artifacts ORDER BY kind ASC",
  ).all();
  const artifactKinds = artifacts.results.map((artifact) => artifact.kind).join(",");
  assert(
    artifactKinds === "attachment_manifest,message_text,normalized_json",
    "inbound email creates normalized JSON, message text, and attachment manifest artifacts",
  );
  const normalizedArtifact = artifacts.results.find(
    (artifact) => artifact.kind === "normalized_json",
  );
  const normalizedEnvelope = JSON.parse(normalizedArtifact.data_json);
  assert(
    normalizedEnvelope.rawObjectRef.objectKey === inboundEmail.raw_object_key &&
      normalizedEnvelope.attachments.length === 2,
    "normalized message artifact links raw email and attachment object refs",
  );

  const lineage = await env.DB.prepare(
    "SELECT relation, COUNT(*) AS count FROM carboti_lineage_edges GROUP BY relation",
  ).all();
  const lineageCountByRelation = Object.fromEntries(
    lineage.results.map((row) => [row.relation, row.count]),
  );
  assert(lineageCountByRelation.contains === 2, "Carboti lineage links raw email to attachments");
  assert(
    lineageCountByRelation.normalized_to === 1,
    "Carboti lineage links raw email to normalized message",
  );
  assert(
    lineageCountByRelation.processed_into === 3,
    "Carboti lineage links normalized message to artifacts",
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
