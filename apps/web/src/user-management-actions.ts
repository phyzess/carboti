import {
  createInvitation,
  deleteInvitation,
  deleteUser,
  resendInvitation,
  revokeInvitation,
} from "./api";
import type { NoticeDescriptor } from "./app-notice";
import { errorMessage } from "./app-session";
import type { InvitationForm } from "./workspace-page-sections/user-management-types";

export type UserManagementActionsOptions = {
  invitationForm: InvitationForm;
  loadUserManagement: () => Promise<void>;
  setAdminError: (message: string | null) => void;
  setBusy: (busy: boolean) => void;
  setCreatedInvitationUrl: (url: string | null) => void;
  setGlobalError: (message: string | null) => void;
  setNotice: (notice: NoticeDescriptor) => void;
};

export function createUserManagementActions(options: UserManagementActionsOptions) {
  async function handleCreateInvitation() {
    await runUserManagementAction(async () => {
      const response = await createInvitation({
        email: options.invitationForm.email,
        role: options.invitationForm.role,
      });
      options.setCreatedInvitationUrl(response.inviteUrl ?? null);
      options.setNotice({
        key:
          response.emailDelivery?.status === "failed"
            ? "notice.invitationEmailFailed"
            : response.inviteUrl
              ? "notice.localInvitationCreated"
              : "notice.invitationEmailRequested",
      });
      await options.loadUserManagement();
    });
  }

  async function handleResendInvitation(invitationId: string) {
    await runUserManagementAction(async () => {
      const response = await resendInvitation(invitationId);
      options.setCreatedInvitationUrl(response.inviteUrl ?? null);
      options.setNotice({
        key:
          response.emailDelivery?.status === "failed"
            ? "notice.invitationEmailFailed"
            : response.inviteUrl
              ? "notice.localInvitationCreated"
              : "notice.invitationResent",
      });
      await options.loadUserManagement();
    });
  }

  async function handleRevokeInvitation(invitationId: string) {
    await runUserManagementAction(async () => {
      await revokeInvitation(invitationId);
      options.setCreatedInvitationUrl(null);
      options.setNotice({ key: "notice.invitationRevoked" });
      await options.loadUserManagement();
    });
  }

  async function handleDeleteInvitation(invitationId: string) {
    await runUserManagementAction(async () => {
      await deleteInvitation(invitationId);
      options.setCreatedInvitationUrl(null);
      options.setNotice({ key: "notice.invitationDeleted" });
      await options.loadUserManagement();
    });
  }

  async function handleDeleteUser(userId: string) {
    await runUserManagementAction(async () => {
      await deleteUser(userId);
      options.setNotice({ key: "notice.userDeleted" });
      await options.loadUserManagement();
    });
  }

  async function runUserManagementAction(action: () => Promise<void>) {
    options.setBusy(true);
    options.setGlobalError(null);
    options.setAdminError(null);
    try {
      await action();
    } catch (caught) {
      options.setAdminError(errorMessage(caught));
    } finally {
      options.setBusy(false);
    }
  }

  return {
    handleCreateInvitation,
    handleDeleteInvitation,
    handleDeleteUser,
    handleResendInvitation,
    handleRevokeInvitation,
  };
}
