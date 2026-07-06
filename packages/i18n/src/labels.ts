import type { Translate } from "./types";

export function createCodeLabeler<TKey extends string>(options: {
  fallback?: (code: string) => string;
  hasMessageKey: (key: string) => key is TKey;
  prefix: string;
  translate: Translate<TKey>;
}): (code: string) => string {
  return (code) => {
    const key = `${options.prefix}.${code}`;
    if (options.hasMessageKey(key)) {
      return options.translate(key);
    }

    return options.fallback?.(code) ?? code;
  };
}
