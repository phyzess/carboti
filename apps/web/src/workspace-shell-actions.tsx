import { AnimatedIcon, Button } from "@carboti/ui";
import { ChevronDown } from "lucide-react";
import { useI18n } from "./i18n";
import { LanguageSelector, ThemeToggleButton } from "./shell-controls";
import type { ApiUser } from "./types";

export function GuestActions() {
  return (
    <>
      <LanguageSelector className="qitu-topbar-control" compact />
      <ThemeToggleButton className="qitu-topbar-control" compact />
    </>
  );
}

export function ShellActions(props: {
  disabled: boolean;
  onOpenUserPanel: () => void;
  onRefresh: () => void;
  user: ApiUser;
}) {
  const { t } = useI18n();
  const displayName = props.user.displayName ?? props.user.email;
  const initial = displayName.slice(0, 1).toUpperCase();
  const userPanelTitle = t("user.openPanel", { name: displayName });

  return (
    <>
      <Button
        aria-label={t("action.refreshWorkspace")}
        className="qitu-topbar-control"
        disabled={props.disabled}
        size="sm"
        title={t("action.refreshWorkspace")}
        variant="ghost"
        onClick={props.onRefresh}
      >
        <AnimatedIcon name="refresh" size={15} />
        <span className="sr-only">{t("action.refresh")}</span>
      </Button>
      <LanguageSelector className="qitu-topbar-control" compact />
      <ThemeToggleButton className="qitu-topbar-control" compact />
      <Button
        aria-label={userPanelTitle}
        className="qitu-account-trigger"
        size="sm"
        title={userPanelTitle}
        variant="ghost"
        onClick={props.onOpenUserPanel}
      >
        <span className="qitu-avatar-mark size-8 text-[length:var(--qitu-text-label-12)] font-semibold">
          {initial}
        </span>
        <ChevronDown size={14} className="text-[var(--qitu-dim)]" />
      </Button>
    </>
  );
}
