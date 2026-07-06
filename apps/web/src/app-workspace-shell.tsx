import type { ReactNode } from "react";
import { AppShell, StatusBadge, Surface, type AppShellNavItem } from "@carboti/ui";
import { useI18n } from "./i18n";

export function WorkspaceShell(props: {
  actions: ReactNode;
  children: ReactNode;
  error: string | null;
  navigation: AppShellNavItem[];
  notice: string;
  subNavigation: AppShellNavItem[];
  onCommand: () => void;
}) {
  const { t } = useI18n();

  return (
    <AppShell
      actions={props.actions}
      brand="qitu"
      commandLabel={t("command.findSourceJobUserAudit")}
      commandShortcutLabel="Cmd K"
      eyebrow={props.notice}
      navigation={props.navigation}
      subNavigation={props.subNavigation}
      onCommand={props.onCommand}
    >
      {props.error ? (
        <Surface className="mb-[var(--qitu-layout-gutter)] p-[var(--qitu-space-s1)]">
          <StatusBadge tone="danger">{t("error.requestFailed")}</StatusBadge>
          <div className="mt-3 text-[length:var(--qitu-text-copy-13)] leading-[var(--qitu-leading-copy-13)] text-[var(--qitu-red)]">
            {props.error}
          </div>
        </Surface>
      ) : null}
      {props.children}
    </AppShell>
  );
}
