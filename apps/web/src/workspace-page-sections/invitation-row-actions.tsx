import { Button, StatusBadge } from "@carboti/ui";
import { Send, Trash2, X } from "lucide-react";
import { useI18n } from "../i18n";
import type { InvitationSummary } from "../types";
import { statusTone } from "./status-tone";

export function InvitationRowActions(props: {
  invitation: InvitationSummary;
  isBusy: boolean;
  onDelete: (invitationId: string) => void;
  onResend: (invitationId: string) => void;
  onRevoke: (invitationId: string) => void;
}) {
  const { formatStatus, roleLabel, t } = useI18n();
  const canRevoke = props.invitation.status === "pending";
  const canResend = props.invitation.status === "pending" || props.invitation.status === "expired";
  const canDelete = props.invitation.status === "revoked";

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <StatusBadge tone={statusTone(props.invitation.status)}>
        {formatStatus(props.invitation.status)}
      </StatusBadge>
      <StatusBadge tone="neutral">{roleLabel(props.invitation.role)}</StatusBadge>
      {props.invitation.latestEmailStatus ? (
        <StatusBadge tone={statusTone(props.invitation.latestEmailStatus)}>
          {formatStatus(props.invitation.latestEmailStatus)}
        </StatusBadge>
      ) : null}
      {canResend ? (
        <Button
          aria-label={t("action.resendInvitationFor", {
            email: props.invitation.email,
          })}
          disabled={props.isBusy}
          size="sm"
          variant="ghost"
          onClick={() => props.onResend(props.invitation.id)}
        >
          <Send size={14} /> {t("action.resend")}
        </Button>
      ) : null}
      {canRevoke ? (
        <Button
          aria-label={t("action.revokeInvitationFor", {
            email: props.invitation.email,
          })}
          disabled={props.isBusy}
          size="sm"
          variant="ghost"
          onClick={() => props.onRevoke(props.invitation.id)}
        >
          <X size={14} /> {t("action.revoke")}
        </Button>
      ) : null}
      {canDelete ? (
        <Button
          aria-label={t("action.deleteInvitationFor", {
            email: props.invitation.email,
          })}
          disabled={props.isBusy}
          size="sm"
          variant="ghost"
          onClick={() => props.onDelete(props.invitation.id)}
        >
          <Trash2 size={14} /> {t("action.delete")}
        </Button>
      ) : null}
    </div>
  );
}
