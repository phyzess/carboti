import type { StatusBadgeTone, TimelineItem } from "@carboti/ui";
import type { Translate } from "../i18n";
import type { ImportJobEvent, ImportJobListItem } from "../types";

export function importJobTimelineItem(
  event: ImportJobEvent,
  formatStatus: (value: string) => string,
  formatTime: (value: string) => string,
  t: Translate,
): TimelineItem {
  const transition = [event.statusFrom, event.statusTo]
    .filter((status): status is string => Boolean(status))
    .map(formatStatus)
    .join(" -> ");

  return {
    description: event.message ?? (transition || t("imports.eventFallback")),
    id: event.id,
    time: formatTime(event.createdAt),
    title: event.eventType,
    tone: timelineTone(event.eventType),
  };
}

export function importRecoveryGuidance(
  job: ImportJobListItem,
  t: Translate,
): { description: string; label: string; tone: StatusBadgeTone } | null {
  if (job.status === "failed") {
    const failureClass = job.failureClass ?? "unknown";
    const keyByFailureClass: Record<string, Parameters<Translate>[0]> = {
      adapter_missing: "imports.recoveryAdapterMissing",
      processing: "imports.recoveryProcessing",
      queue_dispatch: "imports.recoveryQueueDispatch",
      source_missing: "imports.recoverySourceMissing",
      validation: "imports.recoveryValidation",
    };

    return {
      description: t(keyByFailureClass[failureClass] ?? "imports.recoveryUnknown"),
      label: t("imports.retryCandidate"),
      tone:
        failureClass === "queue_dispatch" || failureClass === "source_missing"
          ? "danger"
          : "warning",
    };
  }

  if (job.status === "queued" || job.status === "processing") {
    return {
      description: t("imports.recoveryWaitForProcessing"),
      label: t("imports.inProgress"),
      tone: "warning",
    };
  }

  if (job.status === "needs_review") {
    return {
      description: t("imports.recoveryNeedsReview"),
      label: t("imports.humanReview"),
      tone: "info",
    };
  }

  return null;
}

function timelineTone(action: string): TimelineItem["tone"] {
  if (action.includes("failed") || action.includes("denied")) return "error";
  if (action.includes("queued") || action.includes("requested")) return "warning";
  if (action.includes("succeeded") || action.includes("committed")) return "success";
  if (action.includes("advisory")) return "info";
  return "neutral";
}
