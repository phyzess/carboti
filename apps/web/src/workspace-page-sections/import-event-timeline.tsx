import { AnimatedIcon, SectionHeader, Timeline } from "@carboti/ui";
import { useI18n } from "../i18n";
import type { ImportJobEvent } from "../types";
import { importJobTimelineItem } from "./import-page-helpers";

export function ImportEventTimeline(props: { importJobEvents: ImportJobEvent[] }) {
  const { formatStatus, formatTime, t } = useI18n();
  const importTimeline = props.importJobEvents.map((event) =>
    importJobTimelineItem(event, formatStatus, formatTime, t),
  );

  return (
    <div>
      <SectionHeader
        icon={<AnimatedIcon name="activity" size={16} />}
        title={t("imports.eventStream")}
      />
      <Timeline
        className="mt-[var(--qitu-space-s1)]"
        emptyLabel={t("empty.noEventsDescription")}
        emptyTitle={t("empty.noEvents")}
        items={importTimeline}
      />
    </div>
  );
}
