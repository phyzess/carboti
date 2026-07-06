import type { ReactNode } from "react";

export type AppShellNavItem = {
  label: string;
  active?: boolean;
  href?: string;
  icon?: ReactNode;
  disabled?: boolean;
  onSelect?: () => void;
};

export type AppShellProps = {
  brand: string;
  navigation: AppShellNavItem[];
  subNavigation?: AppShellNavItem[] | undefined;
  actions?: ReactNode;
  children: ReactNode;
  commandLabel?: string;
  commandShortcutLabel?: string;
  eyebrow?: string;
  onCommand?: (() => void) | undefined;
};
