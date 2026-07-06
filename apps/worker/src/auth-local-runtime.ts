import type { AppContext } from "./http-utils";
import { isLocalAppEnv } from "./runtime";

export function isLocalRuntime(context: AppContext): boolean {
  return isLocalAppEnv(context.env);
}
