import { useState } from "react";
import { listInvitations, listUsers } from "./api";
import { errorMessage } from "./app-session";
import type { NoticeDescriptor } from "./app-notice";
import type { ApiUser, InvitationSummary } from "./types";
import { createUserManagementActions } from "./user-management-actions";
import type { InvitationForm } from "./workspace-page-sections/user-management-types";

const defaultInvitationForm: InvitationForm = {
  email: "new-user@example.com",
  role: "viewer",
};

type UserManagementOptions = {
  canManageUsers: boolean;
  setBusy: (busy: boolean) => void;
  setGlobalError: (message: string | null) => void;
  setNotice: (notice: NoticeDescriptor) => void;
  user: ApiUser | null;
};

export function useUserManagement(options: UserManagementOptions) {
  const { canManageUsers, setBusy, setGlobalError, setNotice, user } = options;
  const [adminError, setAdminError] = useState<string | null>(null);
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [invitations, setInvitations] = useState<InvitationSummary[]>([]);
  const [hasLoadedUserManagement, setHasLoadedUserManagement] = useState(false);
  const [isLoadingUserManagement, setIsLoadingUserManagement] = useState(false);
  const [invitationForm, setInvitationForm] = useState(defaultInvitationForm);
  const [createdInvitationUrl, setCreatedInvitationUrl] = useState<string | null>(null);

  async function loadUserManagement() {
    if (!user || !canManageUsers) return;

    setIsLoadingUserManagement(true);
    setAdminError(null);
    try {
      const [userResponse, invitationResponse] = await Promise.all([
        listUsers({ limit: 50 }),
        listInvitations({ limit: 50 }),
      ]);
      setUsers(userResponse.users);
      setInvitations(invitationResponse.invitations);
      setHasLoadedUserManagement(true);
    } catch (caught) {
      setAdminError(errorMessage(caught));
      setHasLoadedUserManagement(true);
    } finally {
      setIsLoadingUserManagement(false);
    }
  }

  function resetUserManagement() {
    setAdminError(null);
    setUsers([]);
    setInvitations([]);
    setHasLoadedUserManagement(false);
    setIsLoadingUserManagement(false);
    setInvitationForm(defaultInvitationForm);
    setCreatedInvitationUrl(null);
  }

  const userManagementActions = createUserManagementActions({
    invitationForm,
    loadUserManagement,
    setAdminError,
    setBusy,
    setCreatedInvitationUrl,
    setGlobalError,
    setNotice,
  });

  return {
    adminError,
    createdInvitationUrl,
    ...userManagementActions,
    hasLoadedUserManagement,
    invitations,
    invitationForm,
    isLoadingUserManagement,
    loadUserManagement,
    resetUserManagement,
    setInvitationForm,
    users,
  };
}
