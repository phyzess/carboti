import { AnimatedIcon, Button, SectionHeader, Surface } from "@carboti/ui";
import { Field, SelectField } from "../app-ui";
import { useI18n } from "../i18n";
import type { InvitationForm } from "./user-management-types";

export function InvitationCreatePanel(props: {
  createdInvitationUrl: string | null;
  invitationForm: InvitationForm;
  isBusy: boolean;
  onCreateInvitation: () => void;
  onInvitationFormChange: (form: InvitationForm) => void;
}) {
  const { t } = useI18n();
  const roleOptions = [
    { label: t("role.viewer"), value: "viewer" },
    { label: t("role.reviewer"), value: "reviewer" },
    { label: t("role.admin"), value: "admin" },
    { label: t("role.owner"), value: "owner" },
  ];

  return (
    <Surface as="aside" className="p-[var(--qitu-space-s1)]">
      <SectionHeader
        icon={<AnimatedIcon name="key" size={16} />}
        title={t("invitation.createTitle")}
      />
      <div className="mt-[var(--qitu-space-s1)] space-y-4">
        <Field
          label={t("field.email")}
          type="email"
          value={props.invitationForm.email}
          onChange={(email) =>
            props.onInvitationFormChange({
              ...props.invitationForm,
              email,
            })
          }
        />
        <SelectField
          label={t("field.role")}
          options={roleOptions}
          value={props.invitationForm.role}
          onChange={(role) =>
            props.onInvitationFormChange({
              ...props.invitationForm,
              role,
            })
          }
        />
        <Button disabled={props.isBusy} onClick={props.onCreateInvitation}>
          <AnimatedIcon name="key" size={15} /> {t("action.createInvitation")}
        </Button>
        {props.createdInvitationUrl ? (
          <a
            className="block break-all text-[length:var(--qitu-text-copy-13)] leading-[var(--qitu-leading-copy-13)] text-[var(--qitu-brand-accent-ink)]"
            href={props.createdInvitationUrl}
          >
            {props.createdInvitationUrl}
          </a>
        ) : null}
      </div>
    </Surface>
  );
}
