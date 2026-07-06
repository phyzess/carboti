import type { ReactNode } from "react";
import { AnimatedIcon, QituMark, StatusBadge } from "@carboti/ui";
import { useI18n } from "./i18n";
import { LanguageSelector, ThemeToggleButton } from "./shell-controls";

export function AuthPageFrame(props: { children: ReactNode; eyebrow: string; notice: string }) {
  const { t } = useI18n();

  return (
    <main className="qitu-auth-page">
      <header className="qitu-auth-header">
        <div className="qitu-auth-brand">
          <span aria-hidden="true" className="qitu-auth-mark">
            <QituMark />
          </span>
          <span className="qitu-auth-wordmark">qitu</span>
        </div>
        <div className="qitu-auth-actions">
          <LanguageSelector className="qitu-topbar-control" compact />
          <ThemeToggleButton className="qitu-topbar-control" compact />
        </div>
      </header>

      <section className="qitu-auth-shell" aria-label={t("auth.pageLabel")}>
        <div className="qitu-auth-intro">
          <StatusBadge tone="active">{props.eyebrow}</StatusBadge>
          <h1>{t("auth.heroTitle")}</h1>
          <p>{t("auth.heroDescription")}</p>
          <div className="qitu-auth-proof-list" aria-label={t("auth.guardrails")}>
            <AuthProof icon="key" title={t("auth.proofSession")} />
            <AuthProof icon="reviews" title={t("auth.proofReview")} />
            <AuthProof icon="audit" title={t("auth.proofAudit")} />
          </div>
          <div className="qitu-auth-status-line">
            <span aria-hidden="true" />
            <strong>{t("common.session")}</strong>
            <em>{props.notice}</em>
          </div>
        </div>

        <div className="qitu-auth-content">{props.children}</div>
      </section>
    </main>
  );
}

export function AuthCardHeader(props: { badge: string; description: string; title: string }) {
  return (
    <div className="min-w-0">
      <StatusBadge tone="info">{props.badge}</StatusBadge>
      <h2 className="qitu-auth-card-title">{props.title}</h2>
      <p className="qitu-auth-card-copy">{props.description}</p>
    </div>
  );
}

function AuthProof(props: { icon: "audit" | "key" | "reviews"; title: string }) {
  return (
    <div className="qitu-auth-proof">
      <AnimatedIcon name={props.icon} size={15} />
      <span>{props.title}</span>
    </div>
  );
}
