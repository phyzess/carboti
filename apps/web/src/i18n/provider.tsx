import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { localeOptions, type Locale, type LocaleMeta } from "./locales";
import { createI18nRuntime, persistLocale, readStoredLocale, type I18nRuntime } from "./runtime";

type I18nContextValue = I18nRuntime & {
  locale: Locale;
  localeMeta: LocaleMeta;
  setLocale: (locale: Locale) => void;
};

export type { Translate } from "./runtime";

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider(props: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => readStoredLocale());
  const localeMeta = localeOptions.find((option) => option.id === locale) ?? localeOptions[0]!;

  useEffect(() => {
    persistLocale(locale, localeMeta);
  }, [locale, localeMeta]);

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
  }, []);

  const runtime = useMemo(() => createI18nRuntime(locale, localeMeta), [locale, localeMeta]);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      localeMeta,
      ...runtime,
      setLocale,
    }),
    [locale, localeMeta, runtime, setLocale],
  );

  return <I18nContext.Provider value={value}>{props.children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const value = useContext(I18nContext);
  if (!value) {
    throw new Error("useI18n must be used inside I18nProvider.");
  }

  return value;
}
