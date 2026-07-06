import type { MessageKey } from "./i18n";

export type NoticeDescriptor = {
  key: MessageKey;
  values?: Record<string, number | string>;
};
