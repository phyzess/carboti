export { boundaryFromContentType, parameterFromHeader } from "./mime-header-parameters";

export type MimeHeaders = Map<string, string>;

export function parseMimeHeaders(headerText: string): MimeHeaders {
  const headers = new Map<string, string>();
  const unfolded = headerText.replace(/\r?\n[ \t]+/g, " ");
  for (const line of unfolded.split(/\r?\n/)) {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex < 0) continue;

    const name = line.slice(0, separatorIndex).trim().toLowerCase();
    const value = line.slice(separatorIndex + 1).trim();
    if (!name) continue;

    const existing = headers.get(name);
    headers.set(name, existing ? `${existing}, ${value}` : value);
  }

  return headers;
}

export function headerValue(headers: MimeHeaders, name: string): string {
  return headers.get(name.toLowerCase()) ?? "";
}
