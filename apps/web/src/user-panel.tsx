import {
  AnimatedIcon,
  Button,
  DialogContent,
  DialogRoot,
  PanelActionButton,
  StatusBadge,
} from "@carboti/ui";
import { ArrowRight } from "lucide-react";
import { routePath, type AppNavigationPath } from "./app-routes";
import { useI18n } from "./i18n";
import type { ApiUser } from "./types";

export function UserPanel(props: {
  canManageUsers: boolean;
  notice: string;
  onClose: () => void;
  onLogout: () => void;
  onNavigate: (path: AppNavigationPath) => void;
  open: boolean;
  runtimeEnvironment: string;
  user: ApiUser;
}) {
  const { formatStatus, roleLabel, t } = useI18n();

  const displayName = props.user.displayName ?? props.user.email;
  const initial = displayName.slice(0, 1).toUpperCase();

  return (
    <DialogRoot modal={false} open={props.open} onOpenChange={(open) => !open && props.onClose()}>
      <DialogContent
        aria-label={t("user.openPanel", { name: displayName })}
        backdropClassName="qitu-dismiss-layer qitu-transparent-backdrop"
        className="fixed right-[var(--qitu-layout-gutter)] top-[calc(var(--qitu-size-bar)+var(--qitu-space-s2))] w-[min(24rem,calc(100vw-2rem))] overflow-hidden"
      >
        <div className="flex items-start gap-3 bg-[var(--qitu-surface-row)] p-[var(--qitu-space-s1)]">
          <div className="qitu-avatar-mark size-10 shrink-0 text-[length:var(--qitu-text-label-14)] font-semibold">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[length:var(--qitu-text-label-14)] font-semibold leading-[var(--qitu-leading-label-14)]">
              {displayName}
            </div>
            <div className="truncate text-[length:var(--qitu-text-label-12)] leading-[var(--qitu-leading-label-12)] text-[var(--qitu-dim)]">
              {props.user.email}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <StatusBadge tone="active">{roleLabel(props.user.role)}</StatusBadge>
              <StatusBadge tone="neutral">{formatStatus(props.runtimeEnvironment)}</StatusBadge>
            </div>
          </div>
        </div>

        <div className="grid gap-1 p-2">
          <PanelActionButton
            description={t("user.accountDescription")}
            icon={<AnimatedIcon name="settings" size={15} />}
            label={t("user.accountSettings")}
            trailing={<ArrowRight className="shrink-0 text-[var(--qitu-dim)]" size={14} />}
            onClick={() => {
              props.onClose();
              props.onNavigate(routePath("account"));
            }}
          />
          {props.canManageUsers ? (
            <PanelActionButton
              description={t("user.managementDescription")}
              icon={<AnimatedIcon name="users" size={15} />}
              label={t("user.managementTitle")}
              trailing={<ArrowRight className="shrink-0 text-[var(--qitu-dim)]" size={14} />}
              onClick={() => {
                props.onClose();
                props.onNavigate(routePath("users"));
              }}
            />
          ) : null}
          <div className="px-2 py-1">
            <div className="truncate text-[length:var(--qitu-text-label-12)] leading-[var(--qitu-leading-label-12)] text-[var(--qitu-dim)]">
              {props.notice}
            </div>
          </div>
          <div className="mt-1 rounded-[var(--qitu-radius-md)] bg-[var(--qitu-surface-row)] p-1">
            <Button
              className="w-full justify-start"
              size="sm"
              variant="ghost"
              onClick={props.onLogout}
            >
              <AnimatedIcon name="logout" size={15} /> {t("action.logout")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </DialogRoot>
  );
}
