import type { FormEvent } from "react";
import { AnimatedIcon, Button, DateField, FilterBar, SectionHeader, Surface } from "@carboti/ui";
import { X } from "lucide-react";
import type { AuditFilters } from "../audit-filters";
import { Field } from "../app-ui";
import { useI18n } from "../i18n";

export function AuditFilterPanel(props: {
  filters: AuditFilters;
  isBusy: boolean;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  onFiltersChange: (filters: AuditFilters) => void;
}) {
  const { localeMeta, t } = useI18n();

  function submitFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    props.onApplyFilters();
  }

  return (
    <Surface className="p-[var(--qitu-space-s1)]">
      <SectionHeader
        description={t("audit.description")}
        icon={<AnimatedIcon name="audit" size={16} />}
        title={t("audit.title")}
      />
      <FilterBar
        actions={
          <>
            <Button disabled={props.isBusy} size="sm" type="submit">
              <AnimatedIcon name="search" size={14} /> {t("action.applyFilters")}
            </Button>
            <Button
              disabled={props.isBusy}
              size="sm"
              type="button"
              variant="ghost"
              onClick={props.onClearFilters}
            >
              <X size={14} /> {t("action.clearFilters")}
            </Button>
          </>
        }
        className="mt-[var(--qitu-space-s1)]"
        onSubmit={submitFilters}
      >
        <Field
          label={t("audit.filterAction")}
          value={props.filters.action}
          onChange={(action) => props.onFiltersChange({ ...props.filters, action })}
        />
        <Field
          label={t("audit.filterActor")}
          value={props.filters.actorId}
          onChange={(actorId) => props.onFiltersChange({ ...props.filters, actorId })}
        />
        <Field
          label={t("audit.filterSubjectKind")}
          value={props.filters.subjectKind}
          onChange={(subjectKind) =>
            props.onFiltersChange({
              ...props.filters,
              subjectKind,
            })
          }
        />
        <Field
          label={t("audit.filterSubjectId")}
          value={props.filters.subjectId}
          onChange={(subjectId) => props.onFiltersChange({ ...props.filters, subjectId })}
        />
        <DateField
          label={t("audit.filterOccurredAfter")}
          labels={{
            nextMonth: t("calendar.nextMonth"),
            previousMonth: t("calendar.previousMonth"),
          }}
          locale={localeMeta.intlLocale}
          placeholder={t("audit.filterDatePlaceholder")}
          value={props.filters.occurredAfter}
          onChange={(occurredAfter) => props.onFiltersChange({ ...props.filters, occurredAfter })}
        />
        <DateField
          label={t("audit.filterOccurredBefore")}
          labels={{
            nextMonth: t("calendar.nextMonth"),
            previousMonth: t("calendar.previousMonth"),
          }}
          locale={localeMeta.intlLocale}
          placeholder={t("audit.filterDatePlaceholder")}
          value={props.filters.occurredBefore}
          onChange={(occurredBefore) => props.onFiltersChange({ ...props.filters, occurredBefore })}
        />
      </FilterBar>
    </Surface>
  );
}
