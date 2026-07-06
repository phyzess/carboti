import type { MessageKey } from "./message-types";
import { zhCoreMessages } from "./messages-zh-cn-core";
import { zhAuthMessages } from "./messages-zh-cn-auth";
import { zhWorkflowMessages } from "./messages-zh-cn-workflow";
import { zhReviewMessages } from "./messages-zh-cn-review";

export const zhMessages: Record<MessageKey, string> = {
  ...zhCoreMessages,
  ...zhAuthMessages,
  ...zhWorkflowMessages,
  ...zhReviewMessages,
};
