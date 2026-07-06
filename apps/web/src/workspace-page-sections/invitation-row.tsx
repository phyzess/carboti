import type { InvitationSummary } from "../types";
import { InvitationRowActions } from "./invitation-row-actions";
import { InvitationRowDetails } from "./invitation-row-details";

export function InvitationRow(props: {
  invitation: InvitationSummary;
  isBusy: boolean;
  onDelete: (invitationId: string) => void;
  onResend: (invitationId: string) => void;
  onRevoke: (invitationId: string) => void;
}) {
  return (
    <div className="qitu-surface-subtle flex flex-wrap items-start justify-between gap-3 p-3">
      <InvitationRowDetails invitation={props.invitation} />
      <InvitationRowActions
        invitation={props.invitation}
        isBusy={props.isBusy}
        onDelete={props.onDelete}
        onResend={props.onResend}
        onRevoke={props.onRevoke}
      />
    </div>
  );
}
