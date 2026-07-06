import type { Permission } from "@carboti/rbac";
import { appCan, normalizeAppRole } from "./rbac-policy";
import type { ApiUser } from "./types";

export type WebPermissions = {
  canCommitImports: boolean;
  canDecideReviews: boolean;
  canManageUsers: boolean;
  canProcessImports: boolean;
  canRetryImports: boolean;
  canUploadSources: boolean;
  canWriteAiAdvisories: boolean;
};

export const defaultWebPermissions: WebPermissions = {
  canCommitImports: false,
  canDecideReviews: false,
  canManageUsers: false,
  canProcessImports: false,
  canRetryImports: false,
  canUploadSources: false,
  canWriteAiAdvisories: false,
};

export function buildWebPermissions(user: ApiUser): WebPermissions {
  return {
    canCommitImports: canUse(user, "import_job:commit"),
    canDecideReviews: canUse(user, "review:decide"),
    canManageUsers: canUse(user, "invitation:create"),
    canProcessImports: canUse(user, "import_job:process"),
    canRetryImports: canUse(user, "import_job:retry"),
    canUploadSources: canUse(user, "source_file:upload"),
    canWriteAiAdvisories: canUse(user, "ai_advisory:write"),
  };
}

function canUse(user: ApiUser, permission: Permission): boolean {
  return appCan(
    {
      id: user.id,
      role: normalizeAppRole(user.role),
    },
    permission,
  );
}
