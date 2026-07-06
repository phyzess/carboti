import { assertAuditActionCoverage } from "./worker-integration-audit-actions.mjs";
import { assertAuditIdentityFilters } from "./worker-integration-audit-identity-filters.mjs";
import { assertAuditTimeFilters } from "./worker-integration-audit-time-filters.mjs";

export async function testAuditFilters({ client, loginAfterReset, upload }) {
  const audit = await client.json("/api/audit-events?limit=100");
  await assertAuditActionCoverage({ audit, client });
  await assertAuditIdentityFilters({ client, loginAfterReset, upload });
  await assertAuditTimeFilters({ audit, client });
}
