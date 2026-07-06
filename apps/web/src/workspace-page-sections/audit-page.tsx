import type { AuditFilters } from "../audit-filters";
import { useI18n } from "../i18n";
import type { AuditEvent } from "../types";
import { AuditEventDetailsPanel } from "./audit-page-details";
import { AuditFilterPanel } from "./audit-page-filters";
import { AuditResultsPanel } from "./audit-page-results";

export function AuditPage(props: {
  auditEvents: AuditEvent[];
  filters: AuditFilters;
  isBusy: boolean;
  selectedEventId: string | null;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  onFiltersChange: (filters: AuditFilters) => void;
  onSelectEvent: (eventId: string) => void;
}) {
  const { formatDateTime, formatTime } = useI18n();
  const selectedEvent =
    props.auditEvents.find((event) => event.id === props.selectedEventId) ??
    props.auditEvents[0] ??
    null;

  return (
    <div className="grid gap-[var(--qitu-layout-gutter)] xl:grid-cols-[minmax(0,1fr)_420px]">
      <section className="space-y-[var(--qitu-layout-gutter)]">
        <AuditFilterPanel
          filters={props.filters}
          isBusy={props.isBusy}
          onApplyFilters={props.onApplyFilters}
          onClearFilters={props.onClearFilters}
          onFiltersChange={props.onFiltersChange}
        />
        <AuditResultsPanel
          auditEvents={props.auditEvents}
          formatTime={formatTime}
          selectedEventId={selectedEvent?.id ?? null}
          onSelectEvent={props.onSelectEvent}
        />
      </section>
      <AuditEventDetailsPanel event={selectedEvent} formatDateTime={formatDateTime} />
    </div>
  );
}
