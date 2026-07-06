import { AnimatedIcon, DataState, SectionHeader, Surface } from "@carboti/ui";
import { RuntimeRow } from "../app-ui";
import { useI18n } from "../i18n";
import type { AuditEvent } from "../types";
import { actorLabel, formatMetadata, subjectLabel } from "./audit-page-helpers";

export function AuditEventDetailsPanel(props: {
  event: AuditEvent | null;
  formatDateTime: (value: string) => string;
}) {
  const { t } = useI18n();

  return (
    <Surface as="aside" className="p-[var(--qitu-space-s1)]">
      <SectionHeader
        icon={<AnimatedIcon name="audit" size={16} />}
        title={t("audit.eventDetails")}
      />
      {props.event ? (
        <div className="mt-[var(--qitu-space-s1)] space-y-3">
          <RuntimeRow label={t("audit.eventId")} value={props.event.id} />
          <RuntimeRow label={t("audit.action")} value={props.event.action} />
          <RuntimeRow label={t("audit.actor")} value={actorLabel(props.event)} />
          <RuntimeRow label={t("audit.subject")} value={subjectLabel(props.event)} />
          <RuntimeRow
            label={t("audit.occurredAt")}
            value={props.formatDateTime(props.event.occurredAt)}
          />
          <div className="qitu-surface-subtle p-3">
            <div className="text-[length:var(--qitu-text-label-12)] leading-[var(--qitu-leading-label-12)] text-[var(--qitu-dim)]">
              {t("audit.metadata")}
            </div>
            <pre className="qitu-number mt-2 max-h-[360px] overflow-auto whitespace-pre-wrap break-words text-[length:var(--qitu-text-label-12)] leading-[var(--qitu-leading-label-12)] text-[var(--qitu-muted)]">
              {formatMetadata(props.event.metadata)}
            </pre>
          </div>
        </div>
      ) : (
        <DataState
          className="mt-[var(--qitu-space-s1)]"
          description={t("audit.selectEventDescription")}
          state="empty"
          title={t("audit.noSelectedEvent")}
        />
      )}
    </Surface>
  );
}
