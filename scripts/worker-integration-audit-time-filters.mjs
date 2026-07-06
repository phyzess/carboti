import { assert, expectApiError } from "./worker-integration-http.mjs";

export async function assertAuditTimeFilters({ audit, client }) {
  const latestAuditEvent = audit.auditEvents[0];
  const latestOccurredAt = Date.parse(latestAuditEvent.occurredAt);
  const auditWindowStart = new Date(latestOccurredAt - 1_000).toISOString();
  const auditWindowEnd = new Date(latestOccurredAt + 1_000).toISOString();
  const dateRangeAudit = await client.json(
    `/api/audit-events?occurredAfter=${encodeURIComponent(auditWindowStart)}&occurredBefore=${encodeURIComponent(auditWindowEnd)}`,
  );
  assert(
    dateRangeAudit.auditEvents.some((event) => event.id === latestAuditEvent.id) &&
      dateRangeAudit.auditEvents.every(
        (event) => event.occurredAt >= auditWindowStart && event.occurredAt < auditWindowEnd,
      ),
    "audit list can filter by occurred-at date range",
  );

  const futureAudit = await client.json(
    `/api/audit-events?occurredAfter=${encodeURIComponent("2999-01-01T00:00:00.000Z")}`,
  );
  assert(futureAudit.auditEvents.length === 0, "future audit date range returns no events");

  await expectApiError(
    await client.request("/api/audit-events?occurredAfter=not-a-date"),
    400,
    "invalid_audit_date_filter",
  );
}
