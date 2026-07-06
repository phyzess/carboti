import { decodeExtendedHeaderParameter } from "./mime-header-codecs";

export function boundaryFromContentType(contentType: string): string | null {
  return parameterFromHeader(contentType, "boundary");
}

export function parameterFromHeader(header: string, name: string): string | null {
  const parameters = splitHeaderParameters(header);
  const exact = parameters.get(name.toLowerCase());
  if (exact) return exact;

  const extended = parameters.get(`${name.toLowerCase()}*`);
  return extended ? decodeExtendedHeaderParameter(extended) : null;
}

function splitHeaderParameters(header: string): Map<string, string> {
  const parameters = new Map<string, string>();
  const parts = splitOutsideQuotes(header, ";").slice(1);

  for (const part of parts) {
    const separatorIndex = part.indexOf("=");
    if (separatorIndex < 0) continue;

    const name = part.slice(0, separatorIndex).trim().toLowerCase();
    const value = stripQuotes(part.slice(separatorIndex + 1).trim());
    if (name) {
      parameters.set(name, value);
    }
  }

  return parameters;
}

function splitOutsideQuotes(value: string, separator: string): string[] {
  const parts: string[] = [];
  let current = "";
  let quoted = false;

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    if (character === '"' && value[index - 1] !== "\\") {
      quoted = !quoted;
    }
    if (character === separator && !quoted) {
      parts.push(current);
      current = "";
      continue;
    }

    current += character;
  }

  parts.push(current);
  return parts;
}

function stripQuotes(value: string): string {
  if (value.startsWith('"') && value.endsWith('"')) {
    return value.slice(1, -1).replace(/\\"/g, '"');
  }

  return value;
}
