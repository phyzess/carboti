import type { ReactNode } from "react";
import {
  AnimatedIcon,
  SectionHeader,
  SelectField as QituSelectField,
  StatusBadge,
  Surface,
  TextField,
} from "@carboti/ui";
import { useI18n } from "./i18n";

export function Panel(props: { children: ReactNode }) {
  return <Surface className="p-[var(--qitu-space-s1)]">{props.children}</Surface>;
}

export function SectionTitle(props: { icon: ReactNode; label: string }) {
  return <SectionHeader icon={props.icon} title={props.label} />;
}

export function AuthLinkLayout(props: {
  badge: string;
  children: ReactNode;
  description: string;
  notice: string;
  title: string;
}) {
  const { t } = useI18n();

  return (
    <div className="mx-auto grid max-w-5xl gap-[var(--qitu-layout-gutter)] md:grid-cols-[1fr_0.8fr]">
      <Panel>
        <div className="flex items-start justify-between gap-4">
          <div>
            <StatusBadge tone="warning">{props.badge}</StatusBadge>
            <h1 className="mt-3 text-[length:var(--qitu-text-heading-20)] font-semibold leading-[var(--qitu-leading-heading-20)]">
              {props.title}
            </h1>
            <div className="mt-2 max-w-[36rem] text-[length:var(--qitu-text-copy-14)] leading-[var(--qitu-leading-copy-14)] text-[var(--qitu-muted)]">
              {props.description}
            </div>
          </div>
          <AnimatedIcon className="text-[var(--qitu-chroma-lime-ink)]" name="key" size={18} />
        </div>
        {props.children}
      </Panel>

      <Panel>
        <SectionTitle
          icon={<AnimatedIcon name="activity" size={16} />}
          label={t("common.runtime")}
        />
        <div className="mt-4 space-y-3">
          <RuntimeRow label={t("common.worker")} value="/api" />
          <RuntimeRow label={t("common.session")} value={props.notice} />
        </div>
      </Panel>
    </div>
  );
}

export function RuntimeRow(props: { label: string; value: string }) {
  return (
    <div className="qitu-readonly-field">
      <div className="qitu-readonly-label">{props.label}</div>
      <div className="qitu-readonly-value">{props.value}</div>
    </div>
  );
}

export function Field(props: {
  label: string;
  onChange: (value: string) => void;
  type?: string;
  value: string;
}) {
  return <TextField {...props} />;
}

export function SelectField(props: {
  label: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  value: string;
}) {
  return <QituSelectField {...props} />;
}

export function ErrorText(props: { children: ReactNode }) {
  return (
    <div className="mt-4 text-[length:var(--qitu-text-copy-13)] text-[var(--qitu-red)]">
      {props.children}
    </div>
  );
}

export function EmptyText(props: { children: ReactNode }) {
  return (
    <div className="text-[length:var(--qitu-text-copy-13)] text-[var(--qitu-muted)]">
      {props.children}
    </div>
  );
}
