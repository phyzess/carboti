import type { WorkspaceShellRouteContentProps } from "./workspace-shell-route-content-types";
import { AccountPage, AuditPage, UsersPage } from "./workspace-pages";

export function SettingsAuditRouteContent({ audit, session }: WorkspaceShellRouteContentProps) {
  return (
    <AuditPage
      auditEvents={audit.pageEvents}
      filters={audit.filterDraft}
      isBusy={session.isBusy}
      onApplyFilters={() => void audit.onApplyFilters()}
      onClearFilters={() => void audit.onClearFilters()}
      onFiltersChange={audit.onFilterDraftChange}
      onSelectEvent={audit.onSelectedEventChange}
      selectedEventId={audit.selectedEventId}
    />
  );
}

export function SettingsUsersRouteContent({
  session,
  userManagement,
}: WorkspaceShellRouteContentProps) {
  return (
    <UsersPage
      adminError={userManagement.adminError}
      canManageUsers={session.permissions.canManageUsers}
      createdInvitationUrl={userManagement.createdInvitationUrl}
      invitationForm={userManagement.invitationForm}
      invitations={userManagement.invitations}
      isBusy={session.isBusy || userManagement.isLoading}
      isLoading={userManagement.isInitialLoad}
      onCreateInvitation={() => void userManagement.onCreateInvitation()}
      onDeleteInvitation={(invitationId) => void userManagement.onDeleteInvitation(invitationId)}
      onDeleteUser={(userId) => void userManagement.onDeleteUser(userId)}
      onInvitationFormChange={userManagement.onInvitationFormChange}
      onRefreshUsers={() => void userManagement.onRefresh()}
      onResendInvitation={(invitationId) => void userManagement.onResendInvitation(invitationId)}
      onRevokeInvitation={(invitationId) => void userManagement.onRevokeInvitation(invitationId)}
      user={session.user}
      users={userManagement.users}
    />
  );
}

export function SettingsAccountRouteContent({ session, shell }: WorkspaceShellRouteContentProps) {
  return (
    <AccountPage
      notice={session.noticeText}
      onLogout={() => {
        shell.closeOverlays();
        void session.onLogout();
      }}
      runtimeEnvironment={session.runtimeEnvironment}
      user={session.user}
    />
  );
}
