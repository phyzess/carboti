import { AnimatedIcon, Button, cn } from "@carboti/ui";
import { useI18n } from "./i18n";
import { useTheme } from "./theme";

export function ThemeToggleButton(props: {
  className?: string | undefined;
  compact?: boolean | undefined;
}) {
  const { t } = useI18n();
  const theme = useTheme();
  const label =
    theme.preference === "system"
      ? t("theme.system", { theme: theme.resolvedTheme })
      : theme.preference === "dark"
        ? t("theme.dark")
        : t("theme.light");
  const title = t("theme.switchWithCurrent", { label });

  return (
    <Button
      aria-label={title}
      className={cn(props.compact ? "size-8 px-0" : undefined, props.className)}
      size="sm"
      title={title}
      variant="ghost"
      onClick={theme.cyclePreference}
    >
      <AnimatedIcon name="theme" size={15} />
      {props.compact ? null : <span>{t("theme.title")}</span>}
    </Button>
  );
}
