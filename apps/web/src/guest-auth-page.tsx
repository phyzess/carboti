import type { FormEventHandler } from "react";
import { AnimatedIcon, Button, SegmentedControl, StatusBadge } from "@carboti/ui";
import { ErrorText, Field } from "./app-ui";
import { type AuthFormState, type AuthMode, type LocalSetupRole } from "./app-session";
import { AuthCardHeader, AuthPageFrame } from "./auth-page-frame";
import { useI18n } from "./i18n";

export function GuestAuthPage(props: {
  authForm: AuthFormState;
  authMode: AuthMode;
  error: string | null;
  isBusy: boolean;
  localSetupAvailable: boolean;
  notice: string;
  setupRole: LocalSetupRole;
  onAuthFormChange: (patch: Partial<AuthFormState>) => void;
  onAuthModeChange: (mode: AuthMode) => void;
  onSetupRoleChange: (role: LocalSetupRole) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
}) {
  const { t } = useI18n();

  return (
    <AuthPageFrame eyebrow={t("auth.secureAccess")} notice={props.notice}>
      <div className="qitu-auth-card">
        <AuthCardHeader
          badge={t("auth.protectedWorkspace")}
          description={t("auth.loginDescription")}
          title={t("auth.loginTitle")}
        />

        <SegmentedControl
          aria-label={t("auth.pageLabel")}
          className={`mt-6 ${props.localSetupAvailable ? "grid-cols-3" : "grid-cols-2"}`}
          items={[
            { label: t("auth.loginTab"), value: "login" as const },
            { label: t("auth.resetTab"), value: "reset" as const },
            ...(props.localSetupAvailable
              ? [{ label: t("auth.setupTab"), value: "setup" as const }]
              : []),
          ]}
          value={props.authMode}
          onValueChange={props.onAuthModeChange}
        />

        {props.authMode === "setup" && props.localSetupAvailable ? (
          <div className="mt-4">
            <div className="mb-3 flex items-center gap-2">
              <StatusBadge tone="warning">{t("auth.localDemo")}</StatusBadge>
              <span className="text-[length:var(--qitu-text-copy-13)] leading-[var(--qitu-leading-copy-13)] text-[var(--qitu-muted)]">
                {t("auth.localDemoDescription")}
              </span>
            </div>
            <SegmentedControl
              aria-label={t("auth.localDemo")}
              className="grid-cols-2"
              items={[
                { label: t("auth.reviewer"), value: "reviewer" as const },
                { label: t("auth.admin"), value: "admin" as const },
              ]}
              value={props.setupRole}
              onValueChange={props.onSetupRoleChange}
            />
          </div>
        ) : null}

        <form className="mt-5 space-y-4" onSubmit={props.onSubmit}>
          <Field
            label={t("field.email")}
            type="email"
            value={props.authForm.email}
            onChange={(value) => props.onAuthFormChange({ email: value })}
          />
          {props.authMode === "setup" && props.localSetupAvailable ? (
            <Field
              label={t("field.displayName")}
              value={props.authForm.displayName}
              onChange={(value) => props.onAuthFormChange({ displayName: value })}
            />
          ) : null}
          {props.authMode === "reset" ? (
            <Field
              label={t("auth.resetToken")}
              value={props.authForm.resetToken}
              onChange={(value) => props.onAuthFormChange({ resetToken: value })}
            />
          ) : null}
          <Field
            label={props.authMode === "reset" ? t("auth.newPassword") : t("auth.password")}
            type="password"
            value={props.authForm.password}
            onChange={(value) => props.onAuthFormChange({ password: value })}
          />
          {props.error ? <ErrorText>{props.error}</ErrorText> : null}
          <Button className="w-full" disabled={props.isBusy} size="lg" type="submit">
            <AnimatedIcon name={props.authMode === "login" ? "login" : "audit"} size={15} />
            {props.authMode === "setup" && props.localSetupAvailable
              ? props.setupRole === "admin"
                ? t("action.useLocalDemoAdmin")
                : t("action.useLocalDemoReviewer")
              : props.authMode === "reset"
                ? props.authForm.resetToken
                  ? t("action.resetPassword")
                  : t("action.sendResetEmail")
                : t("action.login")}
          </Button>
        </form>
      </div>
    </AuthPageFrame>
  );
}
