export const defaultAuditFilters = {
  action: "",
  actorId: "",
  occurredAfter: "",
  occurredBefore: "",
  subjectId: "",
  subjectKind: "",
};

export type AuditFilters = typeof defaultAuditFilters;

export function hasAuditFilters(filters: AuditFilters): boolean {
  return Object.values(filters).some((value) => value.trim().length > 0);
}

export function auditFilterQuery(filters: AuditFilters): {
  action?: string;
  actorId?: string;
  occurredAfter?: string;
  occurredBefore?: string;
  subjectId?: string;
  subjectKind?: string;
} {
  return {
    ...(filters.action.trim() ? { action: filters.action.trim() } : {}),
    ...(filters.actorId.trim() ? { actorId: filters.actorId.trim() } : {}),
    ...(filters.occurredAfter.trim()
      ? { occurredAfter: startOfDateUtc(filters.occurredAfter.trim()) }
      : {}),
    ...(filters.occurredBefore.trim()
      ? { occurredBefore: dayAfterDateUtc(filters.occurredBefore.trim()) }
      : {}),
    ...(filters.subjectId.trim() ? { subjectId: filters.subjectId.trim() } : {}),
    ...(filters.subjectKind.trim() ? { subjectKind: filters.subjectKind.trim() } : {}),
  };
}

function startOfDateUtc(dateValue: string): string {
  return `${dateValue}T00:00:00.000Z`;
}

function dayAfterDateUtc(dateValue: string): string {
  const [year, month, day] = dateValue.split("-").map(Number);
  const date = new Date(Date.UTC(year ?? 0, (month ?? 1) - 1, day ?? 1));
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString();
}
