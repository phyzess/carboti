export function assertCoreInterfaces({ assert, core, db }) {
  assert(
    core.carbotiSourceKinds.includes("cloudflare_email") &&
      core.carbotiProcessorKinds.includes("external_webhook") &&
      core.carbotiArtifactKinds.includes("agent_context_bundle"),
    "core must expose source, processor, and artifact kind registries.",
  );

  const rawKey = core.carbotiRawEmailObjectKey({
    messageId: "msg-1",
    receivedAt: "2026-07-06T10:30:00.000Z",
  });
  assert(
    rawKey === "raw-emails/2026-07-06/msg-1.eml",
    "core must own raw email object key conventions.",
  );

  const parsed = core.parseCarbotiMessageEnvelope({
    attachments: [],
    id: "msg-1",
    rawObjectRef: {
      contentType: "message/rfc822",
      id: "obj-1",
      kind: "raw_email",
      objectKey: rawKey,
    },
    receivedAt: "2026-07-06T10:30:00.000Z",
    sourceId: "source-1",
    workspaceId: "default",
  });
  assert(parsed.id === "msg-1", "core must validate a minimal message envelope.");

  assert(
    db.carbotiArtifacts && db.carbotiLineageEdges && db.carbotiProcessorRuns,
    "db facade must export Carboti artifact, lineage, and processor run tables.",
  );
}
