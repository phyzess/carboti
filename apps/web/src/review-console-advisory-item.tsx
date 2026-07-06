import { Button, StatusBadge } from "@carboti/ui";
import { Check, X } from "lucide-react";
import { useI18n } from "./i18n";
import { statusTone } from "./review-console-helpers";
import type { AiAdvisoryArtifact } from "./types";

export function AiAdvisoryItem(props: {
  advisory: AiAdvisoryArtifact;
  disabled: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
}) {
  const { formatStatus, formatTime, t } = useI18n();
  const canDecide = props.advisory.status === "suggested";

  return (
    <div className="qitu-surface-subtle p-3">
      <div className="flex items-center justify-between gap-3">
        <StatusBadge tone={statusTone(props.advisory.status)}>
          {formatStatus(props.advisory.status)}
        </StatusBadge>
        <span className="qitu-number text-[length:var(--qitu-text-label-12)] leading-[var(--qitu-leading-label-12)] text-[var(--qitu-dim)]">
          {formatTime(props.advisory.createdAt)}
        </span>
      </div>
      <div className="mt-3 text-[length:var(--qitu-text-copy-13)] leading-[var(--qitu-leading-copy-13)]">
        {props.advisory.summary}
      </div>
      <div className="qitu-number mt-2 text-[length:var(--qitu-text-label-12)] leading-[var(--qitu-leading-label-12)] text-[var(--qitu-dim)]">
        {props.advisory.provider}/{props.advisory.model}
      </div>
      {canDecide ? (
        <div className="mt-3 flex flex-wrap justify-end gap-2">
          <Button disabled={props.disabled} size="sm" variant="ghost" onClick={props.onDismiss}>
            <X size={14} /> {t("action.dismiss")}
          </Button>
          <Button disabled={props.disabled} size="sm" variant="secondary" onClick={props.onConfirm}>
            <Check size={14} /> {t("action.confirm")}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
