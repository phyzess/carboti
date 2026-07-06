import { createTranslator, isKnownLocale } from "@carboti/i18n";

import { authEmailMessages, defaultEmailLocale, emailLocaleOptions } from "./auth-email-messages";

export type AuthEmailTemplateInput = {
  appName: string;
  email: string;
  locale?: string | undefined;
  url: string;
};

export function renderInvitationEmail(input: AuthEmailTemplateInput): {
  subject: string;
  text: string;
  html: string;
} {
  const t = createAuthEmailTranslator(input.locale);
  const subject = t("invitation.subject", { appName: input.appName });
  const escapedUrl = escapeHtml(input.url);
  const escapedAppName = escapeHtml(input.appName);

  return {
    subject,
    text: [
      t("invitation.textIntro", { appName: input.appName }),
      "",
      t("invitation.textAction"),
      input.url,
      "",
      t("invitation.textIgnore"),
    ].join("\n"),
    html: [
      `<p>${t("invitation.htmlIntro", { appName: escapedAppName })}</p>`,
      `<p><a href="${escapedUrl}">${t("invitation.htmlAction")}</a></p>`,
      `<p>${t("invitation.htmlIgnore")}</p>`,
    ].join(""),
  };
}

export function renderPasswordResetEmail(input: AuthEmailTemplateInput): {
  subject: string;
  text: string;
  html: string;
} {
  const t = createAuthEmailTranslator(input.locale);
  const subject = t("passwordReset.subject", { appName: input.appName });
  const escapedUrl = escapeHtml(input.url);
  const escapedAppName = escapeHtml(input.appName);

  return {
    subject,
    text: [
      t("passwordReset.textIntro", { appName: input.appName }),
      "",
      t("passwordReset.textAction"),
      input.url,
      "",
      t("passwordReset.textIgnore"),
    ].join("\n"),
    html: [
      `<p>${t("passwordReset.htmlIntro", { appName: escapedAppName })}</p>`,
      `<p><a href="${escapedUrl}">${t("passwordReset.htmlAction")}</a></p>`,
      `<p>${t("passwordReset.htmlIgnore")}</p>`,
    ].join(""),
  };
}

function createAuthEmailTranslator(locale: string | undefined) {
  const resolvedLocale = isKnownLocale(locale, emailLocaleOptions) ? locale : defaultEmailLocale;

  return createTranslator({
    defaultLocale: defaultEmailLocale,
    dictionaries: authEmailMessages,
    locale: resolvedLocale,
  });
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
