import {
  AnimatedIcon,
  DataState,
  DataToolbar,
  ListActionRow,
  SectionHeader,
  StatusBadge,
  Surface,
} from "@carboti/ui";
import { useI18n } from "../i18n";
import type { AuditEvent } from "../types";
import { auditStatusTone, subjectLabel } from "./audit-page-helpers";

export function AuditResultsPanel(props: {
  auditEvents: AuditEvent[];
  formatTime: (value: string) => string;
  selectedEventId: string | null;
  onSelectEvent: (eventId: string) => void;
}) {
  const { t } = useI18n();

  return (
    <Surface className="p-[var(--qitu-space-s1)]">
      <DataToolbar
        actions={
          <StatusBadge tone={props.auditEvents.length > 0 ? "info" : "neutral"}>
            {props.auditEvents.length > 0 ? t("status.ready") : t("status.empty")}
          </StatusBadge>
        }
        meta={t("audit.resultCount", { count: String(props.auditEvents.length) })}
      >
        <SectionHeader
          icon={<AnimatedIcon name="activity" size={16} />}
          title={t("audit.results")}
        />
      </DataToolbar>
      <div className="mt-[var(--qitu-space-s1)]">
        <DataState
          description={t("audit.empty")}
          state={props.auditEvents.length === 0 ? "empty" : "ready"}
          title={t("empty.noEvents")}
        >
          <div className="space-y-2">
            {props.auditEvents.map((event) => (
              <AuditEventRow
                active={event.id === props.selectedEventId}
                event={event}
                formatTime={props.formatTime}
                key={event.id}
                onSelect={() => props.onSelectEvent(event.id)}
              />
            ))}
          </div>
        </DataState>
      </div>
    </Surface>
  );
}

function AuditEventRow(props: {
  active: boolean;
  event: AuditEvent;
  formatTime: (value: string) => string;
  onSelect: () => void;
}) {
  return (
    <ListActionRow
      className={["p-3", props.active ? "qitu-row-card-active" : ""].join(" ")}
      onClick={props.onSelect}
      type="button"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-[length:var(--qitu-text-label-14)] font-medium leading-[var(--qitu-leading-label-14)]">
            {props.event.action}
          </div>
          <div className="mt-1 truncate text-[length:var(--qitu-text-copy-13)] leading-[var(--qitu-leading-copy-13)] text-[var(--qitu-muted)]">
            {subjectLabel(props.event)}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <StatusBadge tone={auditStatusTone(props.event.action)}>
            {props.event.actor.kind}
          </StatusBadge>
          <span className="qitu-number text-[length:var(--qitu-text-label-12)] leading-[var(--qitu-leading-label-12)] text-[var(--qitu-dim)]">
            {props.formatTime(props.event.occurredAt)}
          </span>
        </div>
      </div>
    </ListActionRow>
  );
}
