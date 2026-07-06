import { base64ToBytes, percentEncodedBytes, quotedPrintableBodyToBytes } from "./mime-byte-codecs";

export function decodeHeaderValue(value: string): string {
  return value.replace(/=\?([^?]+)\?([bBqQ])\?([^?]*)\?=/g, (_match, charset, encoding, text) => {
    const bytes =
      encoding.toLowerCase() === "b"
        ? base64ToBytes(String(text).replace(/\s+/g, ""))
        : encodedWordQuotedPrintableToBytes(String(text));
    try {
      return new TextDecoder(String(charset)).decode(bytes);
    } catch {
      return new TextDecoder().decode(bytes);
    }
  });
}

export function decodeExtendedHeaderParameter(value: string): string {
  const match = value.match(/^([^']*)'[^']*'(.*)$/);
  if (!match) return decodeHeaderValue(value);

  const charset = match[1]?.toLowerCase() || "utf-8";
  const bytes = percentEncodedBytes(match[2] ?? "");
  try {
    return new TextDecoder(charset).decode(bytes);
  } catch {
    return new TextDecoder().decode(bytes);
  }
}

function encodedWordQuotedPrintableToBytes(value: string): Uint8Array {
  return quotedPrintableBodyToBytes(value.replace(/_/g, " "));
}
