import { useI18n } from "../i18n";
import type { InvitationSummary } from "../types";

export function InvitationRowDetails(props: { invitation: InvitationSummary }) {
  const { formatDateTime, formatStatus, t } = useI18n();

  return (
    <div className="min-w-0">
      <div className="truncate text-[length:var(--qitu-text-label-14)] font-medium leading-[var(--qitu-leading-label-14)]">
        {props.invitation.email}
      </div>
      <div className="mt-1 grid gap-1 text-[length:var(--qitu-text-copy-13)] leading-[var(--qitu-leading-copy-13)] text-[var(--qitu-muted)]">
        <span className="qitu-number">
          {t("invitation.created", { value: formatDateTime(props.invitation.createdAt) })}
        </span>
        <span className="qitu-number">
          {t("invitation.expires", { value: formatDateTime(props.invitation.expiresAt) })}
        </span>
        {props.invitation.acceptedAt ? (
          <span className="qitu-number">
            {t("invitation.accepted", {
              value: formatDateTime(props.invitation.acceptedAt),
            })}
          </span>
        ) : null}
        {props.invitation.revokedAt ? (
          <span className="qitu-number">
            {t("invitation.revoked", {
              value: formatDateTime(props.invitation.revokedAt),
            })}
          </span>
        ) : null}
        {props.invitation.latestEmailStatus ? (
          <span>
            {t("invitation.latestEmail", {
              status: formatStatus(props.invitation.latestEmailStatus),
            })}
          </span>
        ) : null}
        {props.invitation.latestEmailStatus === "failed" &&
        props.invitation.latestEmailErrorMessage ? (
          <span className="text-[var(--qitu-color-destructive)]">
            {t("invitation.emailError", {
              message: props.invitation.latestEmailErrorMessage,
            })}
          </span>
        ) : null}
      </div>
    </div>
  );
}
