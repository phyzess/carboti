import { AnimatedIcon, DataState, SectionHeader, Surface } from "@carboti/ui";
import { useI18n } from "../i18n";
import type { ApiUser, InvitationSummary } from "../types";
import { InvitationCreatePanel } from "./invitation-create-panel";
import { InvitationListPanel } from "./invitation-list-panel";
import { UserListPanel } from "./user-list-panel";
import type { InvitationForm } from "./user-management-types";

export function UsersPage(props: {
  adminError: string | null;
  canManageUsers: boolean;
  createdInvitationUrl: string | null;
  invitationForm: InvitationForm;
  invitations: InvitationSummary[];
  isBusy: boolean;
  isLoading: boolean;
  onCreateInvitation: () => void;
  onDeleteInvitation: (invitationId: string) => void;
  onDeleteUser: (userId: string) => void;
  onInvitationFormChange: (form: InvitationForm) => void;
  onRefreshUsers: () => void;
  onResendInvitation: (invitationId: string) => void;
  onRevokeInvitation: (invitationId: string) => void;
  user: ApiUser;
  users: ApiUser[];
}) {
  const { t } = useI18n();

  if (!props.canManageUsers) {
    return (
      <Surface className="p-[var(--qitu-space-s1)]">
        <SectionHeader icon={<AnimatedIcon name="users" size={16} />} title={t("users.title")} />
        <div className="mt-[var(--qitu-space-s1)]">
          <DataState
            description={t("error.adminOnlyDescription")}
            state="error"
            title={t("error.adminOnlyTitle")}
          />
        </div>
      </Surface>
    );
  }

  return (
    <div className="grid gap-[var(--qitu-layout-gutter)] xl:grid-cols-[minmax(0,1fr)_380px]">
      <section className="space-y-[var(--qitu-layout-gutter)]">
        <UserListPanel
          adminError={props.adminError}
          currentUserId={props.user.id}
          isBusy={props.isBusy}
          isLoading={props.isLoading}
          users={props.users}
          onDeleteUser={props.onDeleteUser}
          onRefreshUsers={props.onRefreshUsers}
        />
        <InvitationListPanel
          invitations={props.invitations}
          isBusy={props.isBusy}
          isLoading={props.isLoading}
          onDeleteInvitation={props.onDeleteInvitation}
          onResendInvitation={props.onResendInvitation}
          onRevokeInvitation={props.onRevokeInvitation}
        />
      </section>

      <InvitationCreatePanel
        createdInvitationUrl={props.createdInvitationUrl}
        invitationForm={props.invitationForm}
        isBusy={props.isBusy}
        onCreateInvitation={props.onCreateInvitation}
        onInvitationFormChange={props.onInvitationFormChange}
      />
    </div>
  );
}
