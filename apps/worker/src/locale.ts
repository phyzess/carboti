import { localeCandidatesFromAcceptLanguage, resolveLocale, type LocaleMetadata } from "@carboti/i18n";
import { getCookie } from "hono/cookie";
import type { AppContext } from "./http-utils";

export const workerLocaleOptions = [
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

export type WorkerLocale = (typeof workerLocaleOptions)[number]["id"];

export const defaultWorkerLocale: WorkerLocale = "en";
export const localeHeaderName = "x-qitu-locale";
export const localeCookieName = "qitu_locale";

export function localeFromRequest(context: AppContext, body?: unknown): WorkerLocale {
  return resolveLocale({
    candidates: [
      localeCandidateFromBody(body),
      context.req.header(localeHeaderName),
      getCookie(context, localeCookieName),
      ...localeCandidatesFromAcceptLanguage(context.req.header("accept-language")),
    ],
    defaultLocale: defaultWorkerLocale,
    localeOptions: workerLocaleOptions,
  });
}

function localeCandidateFromBody(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;

  const locale = (body as { locale?: unknown }).locale;
  return typeof locale === "string" ? locale : null;
}
