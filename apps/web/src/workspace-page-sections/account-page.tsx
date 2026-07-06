import { AnimatedIcon, Button, SectionHeader, Surface } from "@carboti/ui";
import { X } from "lucide-react";
import { RuntimeRow } from "../app-ui";
import { useI18n } from "../i18n";
import type { ApiUser } from "../types";

export function AccountPage(props: {
  notice: string;
  onLogout: () => void;
  runtimeEnvironment: string;
  user: ApiUser;
}) {
  const { formatDateTime, roleLabel, t } = useI18n();

  return (
    <div className="grid gap-[var(--qitu-layout-gutter)] xl:grid-cols-[minmax(0,1fr)_360px]">
      <Surface className="p-[var(--qitu-space-s1)]">
        <SectionHeader icon={<AnimatedIcon name="key" size={16} />} title={t("account.title")} />
        <div className="mt-[var(--qitu-space-s1)] grid gap-3 md:grid-cols-2">
          <RuntimeRow label={t("account.email")} value={props.user.email} />
          <RuntimeRow
            label={t("account.displayName")}
            value={props.user.displayName ?? t("common.none")}
          />
          <RuntimeRow label={t("account.role")} value={roleLabel(props.user.role)} />
          <RuntimeRow label={t("account.created")} value={formatDateTime(props.user.createdAt)} />
        </div>
        <div className="mt-[var(--qitu-space-s1)] flex flex-wrap gap-2">
          <Button variant="secondary" onClick={props.onLogout}>
            <X size={15} /> {t("action.logout")}
          </Button>
        </div>
      </Surface>

      <Surface as="aside" className="p-[var(--qitu-space-s1)]">
        <SectionHeader
          icon={<AnimatedIcon name="activity" size={16} />}
          title={t("account.session")}
        />
        <div className="mt-[var(--qitu-space-s1)] space-y-3">
          <RuntimeRow label={t("account.runtime")} value={props.runtimeEnvironment} />
          <RuntimeRow label={t("account.status")} value={props.notice} />
          <RuntimeRow label={t("account.cookie")} value={t("account.cookieHttpOnly")} />
        </div>
      </Surface>
    </div>
  );
}
