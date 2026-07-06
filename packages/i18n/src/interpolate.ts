import type { MessageValues } from "./types";

export function interpolate(template: string, values: MessageValues | undefined): string {
  if (!values) return template;

  return Object.entries(values).reduce((result, [name, value]) => {
    return result.replace(new RegExp(`\\{${escapeRegExp(name)}\\}`, "g"), String(value));
  }, template);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
