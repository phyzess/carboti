import { AnimatedIcon, Button, DataState, SectionHeader, StatusBadge, Surface } from "@carboti/ui";
import { Trash2 } from "lucide-react";
import { ErrorText } from "../app-ui";
import { useI18n } from "../i18n";
import type { ApiUser } from "../types";

export function UserListPanel(props: {
  adminError: string | null;
  currentUserId: string;
  isBusy: boolean;
  isLoading: boolean;
  onDeleteUser: (userId: string) => void;
  onRefreshUsers: () => void;
  users: ApiUser[];
}) {
  const { t } = useI18n();

  return (
    <Surface className="p-[var(--qitu-space-s1)]">
      <SectionHeader
        action={
          <Button disabled={props.isBusy} size="sm" variant="ghost" onClick={props.onRefreshUsers}>
            <AnimatedIcon name="refresh" size={14} /> {t("action.refresh")}
          </Button>
        }
        icon={<AnimatedIcon name="users" size={16} />}
        title={t("users.title")}
      />
      {props.adminError ? <ErrorText>{props.adminError}</ErrorText> : null}
      <div className="mt-[var(--qitu-space-s1)]">
        <DataState
          description={
            props.isLoading ? t("users.loadingDescription") : t("users.acceptedDescription")
          }
          state={props.isLoading ? "loading" : props.users.length === 0 ? "empty" : "ready"}
          title={props.isLoading ? t("users.loadingTitle") : t("users.emptyTitle")}
        >
          <div className="space-y-2">
            {props.users.map((user) => (
              <UserRow
                currentUserId={props.currentUserId}
                isBusy={props.isBusy}
                key={user.id}
                user={user}
                onDelete={props.onDeleteUser}
              />
            ))}
          </div>
        </DataState>
      </div>
    </Surface>
  );
}

function UserRow(props: {
  currentUserId: string;
  isBusy: boolean;
  onDelete: (userId: string) => void;
  user: ApiUser;
}) {
  const { formatDateTime, roleLabel, t } = useI18n();
  const canDelete = props.user.id !== props.currentUserId;

  return (
    <div className="qitu-surface-subtle flex flex-wrap items-center justify-between gap-3 p-3">
      <div className="min-w-0">
        <div className="truncate text-[length:var(--qitu-text-label-14)] font-medium leading-[var(--qitu-leading-label-14)]">
          {props.user.email}
        </div>
        <div className="text-[length:var(--qitu-text-copy-13)] leading-[var(--qitu-leading-copy-13)] text-[var(--qitu-muted)]">
          {props.user.displayName ?? t("user.noDisplayName")}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <StatusBadge tone="active">{roleLabel(props.user.role)}</StatusBadge>
        <span className="qitu-number text-[length:var(--qitu-text-label-12)] leading-[var(--qitu-leading-label-12)] text-[var(--qitu-dim)]">
          {formatDateTime(props.user.createdAt)}
        </span>
        <Button
          aria-label={t("action.deleteMemberFor", {
            email: props.user.email,
          })}
          disabled={props.isBusy || !canDelete}
          size="sm"
          variant="ghost"
          onClick={() => props.onDelete(props.user.id)}
        >
          <Trash2 size={14} /> {t("action.delete")}
        </Button>
      </div>
    </div>
  );
}
