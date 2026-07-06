import { useMemo } from "react";
import { AnimatedIcon, SectionHeader, Surface, Timeline, type TimelineItem } from "@carboti/ui";
import { useI18n } from "./i18n";
import { timelineTone } from "./review-console-helpers";
import type { AuditEvent, ImportJobEvent } from "./types";

export function ReviewImportTimelinePanel(props: { importJobEvents: ImportJobEvent[] }) {
  const { formatStatus, formatTime, t } = useI18n();
  const importTimeline: TimelineItem[] = useMemo(
    () =>
      props.importJobEvents.map((event) => {
        const transition = [event.statusFrom, event.statusTo]
          .filter((status): status is string => Boolean(status))
          .map(formatStatus)
          .join(" -> ");

        return {
          id: event.id,
          title: event.eventType,
          description: event.message ?? (transition || t("imports.eventFallback")),
          time: formatTime(event.createdAt),
          tone: timelineTone(event.eventType),
        };
      }),
    [formatStatus, formatTime, props.importJobEvents, t],
  );

  return (
    <Surface as="aside" className="p-[var(--qitu-space-s1)]">
      <SectionHeader
        icon={<AnimatedIcon name="activity" size={16} />}
        title={t("review.eventStream")}
      />
      <Timeline
        className="mt-[var(--qitu-space-s1)]"
        emptyLabel={t("review.eventEmpty")}
        emptyTitle={t("empty.noEvents")}
        items={importTimeline}
      />
    </Surface>
  );
}

export function ReviewAuditTimelinePanel(props: { auditEvents: AuditEvent[] }) {
  const { formatTime, t } = useI18n();
  const auditTimeline: TimelineItem[] = useMemo(
    () =>
      props.auditEvents.map((event) => ({
        id: event.id,
        title: event.action,
        description: `${event.subject.kind}:${event.subject.id}`,
        time: formatTime(event.occurredAt),
        tone: timelineTone(event.action),
      })),
    [formatTime, props.auditEvents],
  );

  return (
    <Surface as="aside" className="p-[var(--qitu-space-s1)]">
      <SectionHeader icon={<AnimatedIcon name="reviews" size={16} />} title={t("audit.title")} />
      <Timeline
        className="mt-[var(--qitu-space-s1)]"
        emptyLabel={t("audit.empty")}
        emptyTitle={t("empty.noEvents")}
        items={auditTimeline}
      />
    </Surface>
  );
}
