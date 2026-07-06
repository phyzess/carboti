import type { ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "./alert-dialog";
import { cn } from "./utils";

export function ConfirmDialog(props: {
  cancelLabel: string;
  children?: ReactNode | undefined;
  className?: string | undefined;
  confirmLabel: string;
  description?: ReactNode | undefined;
  disabled?: boolean | undefined;
  onConfirm: () => void;
  onOpenChange?: (open: boolean) => void;
  open: boolean;
  title: ReactNode;
  tone?: "danger" | "neutral" | undefined;
}) {
  return (
    <AlertDialog open={props.open} onOpenChange={props.onOpenChange}>
      <AlertDialogContent className={cn("qitu-confirm-dialog", props.className)}>
        <AlertDialogTitle className="qitu-confirm-dialog-title">{props.title}</AlertDialogTitle>
        {props.description ? (
          <AlertDialogDescription className="qitu-confirm-dialog-description">
            {props.description}
          </AlertDialogDescription>
        ) : null}
        {props.children}
        <AlertDialogFooter className="mt-[var(--qitu-space-s1)]">
          <AlertDialogCancel variant="ghost">{props.cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            className={props.tone === "danger" ? "text-[var(--qitu-red)]" : undefined}
            disabled={props.disabled}
            variant="secondary"
            onClick={props.onConfirm}
          >
            {props.confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
