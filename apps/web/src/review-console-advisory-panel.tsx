import { AnimatedIcon, Button, DataState, SectionHeader, Surface } from "@carboti/ui";
import { useI18n } from "./i18n";
import { AiAdvisoryItem } from "./review-console-advisory-item";
import { PermissionHint } from "./review-console-parts";
import type { AiAdvisoryArtifact } from "./types";

export function ReviewConsoleAdvisoryPanel(props: {
  aiAdvisories: AiAdvisoryArtifact[];
  canWriteAiAdvisories: boolean;
  isBusy: boolean;
  onConfirmAdvisory: (advisoryId: string) => void;
  onDismissAdvisory: (advisoryId: string) => void;
  onGenerateAdvisory: () => void;
  selectedJobId: string | null;
}) {
  const { t } = useI18n();

  return (
    <Surface as="aside" className="p-[var(--qitu-space-s1)]">
      <SectionHeader
        action={
          <Button
            disabled={!props.selectedJobId || props.isBusy || !props.canWriteAiAdvisories}
            size="sm"
            variant="ghost"
            onClick={props.onGenerateAdvisory}
          >
            <AnimatedIcon name="sparkles" size={14} /> {t("action.generate")}
          </Button>
        }
        icon={<AnimatedIcon name="sparkles" size={16} />}
        title={t("advisory.title")}
      />
      <div className="mt-[var(--qitu-space-s1)]">
        <DataState
          description={t("advisory.description")}
          state={props.aiAdvisories.length === 0 ? "empty" : "ready"}
          title={t("advisory.emptyTitle")}
        >
          <div className="space-y-3">
            {props.aiAdvisories.map((advisory) => (
              <AiAdvisoryItem
                advisory={advisory}
                disabled={props.isBusy || !props.canWriteAiAdvisories}
                key={advisory.id}
                onConfirm={() => props.onConfirmAdvisory(advisory.id)}
                onDismiss={() => props.onDismissAdvisory(advisory.id)}
              />
            ))}
          </div>
        </DataState>
        {!props.canWriteAiAdvisories ? (
          <div className="mt-3">
            <PermissionHint label={t("permission.aiAdvisory")} />
          </div>
        ) : null}
      </div>
    </Surface>
  );
}
