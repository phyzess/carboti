import { AnimatedIcon, DataState, SectionHeader, Surface } from "@carboti/ui";
import { useI18n } from "../i18n";
import type { InvitationSummary } from "../types";
import { InvitationRow } from "./invitation-row";

export function InvitationListPanel(props: {
  invitations: InvitationSummary[];
  isBusy: boolean;
  isLoading: boolean;
  onDeleteInvitation: (invitationId: string) => void;
  onResendInvitation: (invitationId: string) => void;
  onRevokeInvitation: (invitationId: string) => void;
}) {
  const { t } = useI18n();

  return (
    <Surface className="p-[var(--qitu-space-s1)]">
      <SectionHeader icon={<AnimatedIcon name="audit" size={16} />} title={t("invitation.title")} />
      <div className="mt-[var(--qitu-space-s1)]">
        <DataState
          description={
            props.isLoading
              ? t("invitation.loadingDescription")
              : t("invitation.pendingDescription")
          }
          state={props.isLoading ? "loading" : props.invitations.length === 0 ? "empty" : "ready"}
          title={props.isLoading ? t("invitation.loadingTitle") : t("invitation.emptyTitle")}
        >
          <div className="space-y-2">
            {props.invitations.map((invitation) => (
              <InvitationRow
                invitation={invitation}
                isBusy={props.isBusy}
                key={invitation.id}
                onDelete={props.onDeleteInvitation}
                onResend={props.onResendInvitation}
                onRevoke={props.onRevokeInvitation}
              />
            ))}
          </div>
        </DataState>
      </div>
    </Surface>
  );
}
