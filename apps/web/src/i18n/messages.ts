import type { Dictionary } from "@carboti/i18n";
import type { Locale } from "./locales";
import type { MessageKey } from "./message-types";
import { enMessages } from "./messages-en";
import { zhMessages } from "./messages-zh-cn";

export { enMessages } from "./messages-en";
export { zhMessages } from "./messages-zh-cn";
export type { MessageKey } from "./message-types";

export const messages: Record<Locale, Dictionary<MessageKey>> = {
  en: enMessages,
  "zh-CN": zhMessages,
};
