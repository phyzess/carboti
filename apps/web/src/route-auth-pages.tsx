import type { FormEventHandler } from "react";
import { AnimatedIcon, Button, StatusBadge } from "@carboti/ui";
import { ErrorText, Field } from "./app-ui";
import type { AuthFormState } from "./app-session";
import { AuthCardHeader, AuthPageFrame } from "./auth-page-frame";
import { useI18n } from "./i18n";

export function AuthLoadingPage(props: { notice: string }) {
  const { t } = useI18n();

  return (
    <AuthPageFrame eyebrow={t("auth.secureAccess")} notice={props.notice}>
      <div className="qitu-auth-card">
        <StatusBadge tone="info">{t("loading.session")}</StatusBadge>
        <h1 className="qitu-auth-card-title">{t("auth.loadingTitle")}</h1>
        <p className="qitu-auth-card-copy">{t("auth.loadingDescription")}</p>
        <div className="qitu-auth-skeleton-stack" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </AuthPageFrame>
  );
}

export function InviteAcceptPage(props: {
  authForm: AuthFormState;
  error: string | null;
  isBusy: boolean;
  notice: string;
  onAuthFormChange: (patch: Partial<AuthFormState>) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
}) {
  const { t } = useI18n();

  return (
    <AuthPageFrame eyebrow={t("auth.invitationBadge")} notice={props.notice}>
      <div className="qitu-auth-card">
        <AuthCardHeader
          badge={t("auth.invitationBadge")}
          description={t("auth.acceptInvitationDescription")}
          title={t("auth.acceptInvitation")}
        />
        <form className="mt-5 space-y-4" onSubmit={props.onSubmit}>
          <Field
            label={t("field.displayName")}
            value={props.authForm.displayName}
            onChange={(value) => props.onAuthFormChange({ displayName: value })}
          />
          <Field
            label={t("auth.password")}
            type="password"
            value={props.authForm.password}
            onChange={(value) => props.onAuthFormChange({ password: value })}
          />
          {props.error ? <ErrorText>{props.error}</ErrorText> : null}
          <Button disabled={props.isBusy} type="submit">
            <AnimatedIcon name="audit" size={15} /> {t("auth.acceptInvitation")}
          </Button>
        </form>
      </div>
    </AuthPageFrame>
  );
}

export function RoutePasswordResetPage(props: {
  authForm: AuthFormState;
  error: string | null;
  isBusy: boolean;
  notice: string;
  onAuthFormChange: (patch: Partial<AuthFormState>) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
}) {
  const { t } = useI18n();

  return (
    <AuthPageFrame eyebrow={t("auth.passwordResetBadge")} notice={props.notice}>
      <div className="qitu-auth-card">
        <AuthCardHeader
          badge={t("auth.passwordResetBadge")}
          description={t("auth.resetDescription")}
          title={t("action.resetPassword")}
        />
        <form className="mt-5 space-y-4" onSubmit={props.onSubmit}>
          <Field
            label={t("auth.newPassword")}
            type="password"
            value={props.authForm.password}
            onChange={(value) => props.onAuthFormChange({ password: value })}
          />
          {props.error ? <ErrorText>{props.error}</ErrorText> : null}
          <Button disabled={props.isBusy} type="submit">
            <AnimatedIcon name="audit" size={15} /> {t("action.resetPassword")}
          </Button>
        </form>
      </div>
    </AuthPageFrame>
  );
}
