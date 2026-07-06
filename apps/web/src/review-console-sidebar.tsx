import { ReviewConsoleAdvisoryPanel } from "./review-console-advisory-panel";
import { ReviewConsoleGuardrailsPanel } from "./review-console-guardrails-panel";
import {
  ReviewAuditTimelinePanel,
  ReviewImportTimelinePanel,
} from "./review-console-timeline-panels";
import type { AiAdvisoryArtifact, AuditEvent, ImportJobEvent } from "./types";

export function ReviewConsoleSidebar(props: {
  aiAdvisories: AiAdvisoryArtifact[];
  auditEvents: AuditEvent[];
  canWriteAiAdvisories: boolean;
  importJobEvents: ImportJobEvent[];
  isBusy: boolean;
  onConfirmAdvisory: (advisoryId: string) => void;
  onDismissAdvisory: (advisoryId: string) => void;
  onGenerateAdvisory: () => void;
  selectedJobId: string | null;
}) {
  return (
    <aside className="space-y-[var(--qitu-layout-gutter)]">
      <ReviewConsoleGuardrailsPanel />
      <ReviewConsoleAdvisoryPanel
        aiAdvisories={props.aiAdvisories}
        canWriteAiAdvisories={props.canWriteAiAdvisories}
        isBusy={props.isBusy}
        onConfirmAdvisory={props.onConfirmAdvisory}
        onDismissAdvisory={props.onDismissAdvisory}
        onGenerateAdvisory={props.onGenerateAdvisory}
        selectedJobId={props.selectedJobId}
      />
      <ReviewImportTimelinePanel importJobEvents={props.importJobEvents} />
      <ReviewAuditTimelinePanel auditEvents={props.auditEvents} />
    </aside>
  );
}
