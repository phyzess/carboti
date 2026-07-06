import {
  AnimatedIcon,
  Button,
  cn,
  MenuContent,
  MenuGroupLabel,
  MenuRadioGroup,
  MenuRadioItem,
  MenuRoot,
  MenuTrigger,
} from "@carboti/ui";
import { ChevronDown } from "lucide-react";
import { localeOptions, useI18n, type Locale } from "./i18n";

export function LanguageSelector(props: {
  className?: string | undefined;
  compact?: boolean | undefined;
}) {
  const { locale, localeMeta, setLocale, t } = useI18n();
  const currentLabel = t("language.current", { label: localeMeta.label });
  const title = `${t("language.choose")}. ${currentLabel}`;

  return (
    <MenuRoot modal={false}>
      <MenuTrigger
        render={
          <Button
            aria-label={title}
            className={cn(props.compact ? "size-8 px-0" : undefined, props.className)}
            size="sm"
            title={title}
            variant="ghost"
          >
            <AnimatedIcon name="language" size={15} />
            <span className={props.compact ? "sr-only" : undefined}>
              {props.compact ? t("language.choose") : localeMeta.shortLabel}
            </span>
            {props.compact ? null : <ChevronDown aria-hidden="true" size={13} />}
          </Button>
        }
      />
      <MenuContent aria-label={t("language.menuTitle")} className="w-44">
        <MenuRadioGroup
          value={locale}
          onValueChange={(value) => {
            globalThis.setTimeout(() => setLocale(value as Locale), 0);
          }}
        >
          <MenuGroupLabel>{currentLabel}</MenuGroupLabel>
          {localeOptions.map((option) => {
            const selected = option.id === locale;
            return (
              <MenuRadioItem
                aria-label={
                  selected ? t("language.optionSelected", { label: option.label }) : option.label
                }
                className="min-h-9 w-full px-2 py-1"
                key={option.id}
                value={option.id}
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[length:var(--qitu-text-label-13)] font-medium leading-[var(--qitu-leading-label-14)]">
                    {option.label}
                  </span>
                  <span className="block text-[length:var(--qitu-text-label-12)] leading-[var(--qitu-leading-label-12)] text-[var(--qitu-dim)]">
                    {option.id}
                  </span>
                </span>
              </MenuRadioItem>
            );
          })}
        </MenuRadioGroup>
      </MenuContent>
    </MenuRoot>
  );
}
