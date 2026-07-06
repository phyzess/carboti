import { assert } from "./worker-integration-http.mjs";

export async function assertAuditIdentityFilters({ client, loginAfterReset, upload }) {
  const actorAudit = await client.json(
    `/api/audit-events?actorId=${encodeURIComponent(loginAfterReset.user.id)}`,
  );
  assert(
    actorAudit.auditEvents.length > 0 &&
      actorAudit.auditEvents.every((event) => event.actor.id === loginAfterReset.user.id),
    "audit list can filter by actor id",
  );

  const subjectAudit = await client.json(
    `/api/audit-events?subjectKind=import_job&subjectId=${encodeURIComponent(upload.importJobId)}`,
  );
  assert(
    subjectAudit.auditEvents.length > 0 &&
      subjectAudit.auditEvents.every(
        (event) => event.subject.kind === "import_job" && event.subject.id === upload.importJobId,
      ),
    "audit list can filter by subject",
  );
}
