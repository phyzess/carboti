import { defineMessages, type Dictionary, type LocaleMetadata } from "@carboti/i18n";

export const emailLocaleOptions = [
  {
    id: "en",
    label: "English",
    shortLabel: "EN",
    htmlLang: "en",
    intlLocale: "en-GB",
  },
  {
    id: "zh-CN",
    label: "简体中文",
    shortLabel: "中",
    htmlLang: "zh-CN",
    intlLocale: "zh-CN",
  },
] as const satisfies readonly LocaleMetadata<string>[];

export type EmailLocale = (typeof emailLocaleOptions)[number]["id"];

export const defaultEmailLocale: EmailLocale = "en";

const enAuthEmailMessages = defineMessages({
  "invitation.htmlAction": "Create your account",
  "invitation.htmlIgnore": "If you did not expect this invitation, you can ignore this email.",
  "invitation.htmlIntro": "You have been invited to {appName}.",
  "invitation.subject": "Join {appName}",
  "invitation.textAction": "Open this link to create your account:",
  "invitation.textIgnore": "If you did not expect this invitation, you can ignore this email.",
  "invitation.textIntro": "You have been invited to {appName}.",
  "passwordReset.htmlAction": "Set a new password",
  "passwordReset.htmlIgnore":
    "This link expires soon. If you did not request it, you can ignore this email.",
  "passwordReset.htmlIntro": "A password reset was requested for {appName}.",
  "passwordReset.subject": "Reset your {appName} password",
  "passwordReset.textAction": "Open this link to set a new password:",
  "passwordReset.textIgnore":
    "This link expires soon. If you did not request it, you can ignore this email.",
  "passwordReset.textIntro": "A password reset was requested for {appName}.",
});

type AuthEmailMessageKey = keyof typeof enAuthEmailMessages;

const zhCnAuthEmailMessages: Record<AuthEmailMessageKey, string> = {
  "invitation.htmlAction": "创建账户",
  "invitation.htmlIgnore": "如果你没有预期收到这封邀请，可以忽略此邮件。",
  "invitation.htmlIntro": "你已被邀请加入 {appName}。",
  "invitation.subject": "加入 {appName}",
  "invitation.textAction": "打开此链接创建你的账户：",
  "invitation.textIgnore": "如果你没有预期收到这封邀请，可以忽略此邮件。",
  "invitation.textIntro": "你已被邀请加入 {appName}。",
  "passwordReset.htmlAction": "设置新密码",
  "passwordReset.htmlIgnore": "此链接会很快过期。如果不是你本人请求，可以忽略此邮件。",
  "passwordReset.htmlIntro": "{appName} 收到了密码重置请求。",
  "passwordReset.subject": "重置你的 {appName} 密码",
  "passwordReset.textAction": "打开此链接设置新密码：",
  "passwordReset.textIgnore": "此链接会很快过期。如果不是你本人请求，可以忽略此邮件。",
  "passwordReset.textIntro": "{appName} 收到了密码重置请求。",
};

export const authEmailMessages: Record<EmailLocale, Dictionary<AuthEmailMessageKey>> = {
  en: enAuthEmailMessages,
  "zh-CN": zhCnAuthEmailMessages,
};
