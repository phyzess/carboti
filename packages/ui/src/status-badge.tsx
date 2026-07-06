import type { ReactNode } from "react";
import { Badge } from "./badge";
import { cn } from "./utils";

export type StatusBadgeTone =
  | "neutral"
  | "active"
  | "success"
  | "warning"
  | "danger"
  | "review"
  | "info";

const toneClass: Record<StatusBadgeTone, string> = {
  neutral: "bg-[var(--qitu-surface-row-active)] text-[var(--qitu-muted)]",
  active: "bg-[var(--qitu-brand-accent-soft)] text-[var(--qitu-brand-accent-ink)]",
  success: "bg-[var(--qitu-chroma-lime-soft)] text-[var(--qitu-chroma-lime-ink)]",
  warning: "bg-[var(--qitu-chroma-pink-soft)] text-[var(--qitu-chroma-pink-ink)]",
  danger: "bg-[var(--qitu-danger-soft)] text-[var(--qitu-red)]",
  review: "bg-[var(--qitu-chroma-lilac-soft)] text-[var(--qitu-chroma-lilac-ink)]",
  info: "bg-[var(--qitu-chroma-lilac-soft)] text-[var(--qitu-chroma-lilac-ink)]",
};

export type StatusBadgeProps = {
  children: ReactNode;
  tone?: StatusBadgeTone;
  className?: string;
};

export function StatusBadge({ children, className, tone = "neutral" }: StatusBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "min-h-[22px] rounded-[var(--qitu-radius-md)] px-[var(--qitu-space-o3)] py-[var(--qitu-space-o0)] text-[10px] leading-4",
        toneClass[tone],
        className,
      )}
    >
      {children}
    </Badge>
  );
}
