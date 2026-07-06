import { AnimatedIcon, SectionHeader, Surface } from "@carboti/ui";
import { useI18n } from "./i18n";
import { Guardrail } from "./review-console-parts";

export function ReviewConsoleGuardrailsPanel() {
  const { t } = useI18n();

  return (
    <Surface as="aside" className="p-[var(--qitu-space-s1)]">
      <SectionHeader
        icon={<AnimatedIcon name="audit" size={16} />}
        title={t("review.guardrails")}
      />
      <div className="mt-[var(--qitu-space-s1)] space-y-2">
        <Guardrail label={t("guardrail.reviewerIdentity")} state="active" />
        <Guardrail label={t("guardrail.rejectedRows")} state="active" />
        <Guardrail label={t("guardrail.aiAdvisory")} state="active" />
        <Guardrail label={t("guardrail.auditDecision")} state="active" />
      </div>
    </Surface>
  );
}
