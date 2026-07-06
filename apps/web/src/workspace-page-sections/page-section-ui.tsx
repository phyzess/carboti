import type { ReactNode } from "react";
import { ListActionRow, StatusBadge } from "@carboti/ui";
import { useI18n } from "../i18n";

export function WorkflowTarget(props: {
  description: string;
  icon: ReactNode;
  label: string;
  onClick: () => void;
  status: string;
}) {
  return (
    <ListActionRow onClick={props.onClick} type="button" variant="card">
      <div className="flex items-start justify-between gap-3">
        <span className="text-[var(--qitu-brand-accent)]">{props.icon}</span>
        <StatusBadge tone="neutral">{props.status}</StatusBadge>
      </div>
      <div className="mt-4 text-[length:var(--qitu-text-heading-16)] font-semibold leading-[var(--qitu-leading-heading-16)]">
        {props.label}
      </div>
      <div className="mt-2 text-[length:var(--qitu-text-copy-13)] leading-[var(--qitu-leading-copy-13)] text-[var(--qitu-muted)]">
        {props.description}
      </div>
    </ListActionRow>
  );
}

export function Guardrail(props: { label: string }) {
  const { formatStatus } = useI18n();

  return (
    <div className="qitu-surface-subtle flex items-center justify-between gap-3 px-3 py-2">
      <div className="text-[length:var(--qitu-text-label-13)] leading-[var(--qitu-leading-label-13)]">
        {props.label}
      </div>
      <StatusBadge tone="active">{formatStatus("active")}</StatusBadge>
    </div>
  );
}

export function PermissionHint(props: { label: string }) {
  const { t } = useI18n();

  return (
    <div className="qitu-surface-subtle flex flex-wrap items-center justify-between gap-3 px-3 py-2">
      <div className="text-[length:var(--qitu-text-label-13)] leading-[var(--qitu-leading-label-13)] text-[var(--qitu-muted)]">
        {props.label}
      </div>
      <StatusBadge tone="neutral">{t("permission.readOnly")}</StatusBadge>
    </div>
  );
}
