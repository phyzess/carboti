import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

type ThemeContextValue = {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
  cyclePreference: () => void;
};

const storageKey = "qitu.theme";

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function applyInitialTheme(): void {
  applyResolvedThemeToDocument(resolveTheme(readStoredPreference()));
}

export function ThemeProvider(props: { children: ReactNode }) {
  const [preference, setPreference] = useState<ThemePreference>(() => readStoredPreference());
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    resolveTheme(readStoredPreference()),
  );

  useEffect(() => {
    if (preference === "system") {
      window.localStorage.removeItem(storageKey);
    } else {
      window.localStorage.setItem(storageKey, preference);
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const applyResolvedTheme = () => setResolvedTheme(resolveTheme(preference));
    applyResolvedTheme();

    if (preference !== "system") return undefined;

    media.addEventListener("change", applyResolvedTheme);
    return () => media.removeEventListener("change", applyResolvedTheme);
  }, [preference]);

  useLayoutEffect(() => {
    applyResolvedThemeToDocument(resolvedTheme);
  }, [resolvedTheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      cyclePreference: () => {
        setPreference((current) => {
          if (current === "system") return "light";
          if (current === "light") return "dark";
          return "system";
        });
      },
      preference,
      resolvedTheme,
      setPreference,
    }),
    [preference, resolvedTheme],
  );

  return <ThemeContext.Provider value={value}>{props.children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error("useTheme must be used inside ThemeProvider.");
  }

  return value;
}

function readStoredPreference(): ThemePreference {
  const stored = window.localStorage.getItem(storageKey);
  if (stored === "light" || stored === "dark" || stored === "system") return stored;
  return "system";
}

function resolveTheme(preference: ThemePreference): ResolvedTheme {
  if (preference !== "system") return preference;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyResolvedThemeToDocument(theme: ResolvedTheme): void {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.classList.toggle("dark", theme === "dark");
}
