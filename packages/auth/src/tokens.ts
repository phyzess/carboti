import { base64UrlEncode } from "./base64-url";

const defaultTokenByteLength = 32;
const textEncoder = new TextEncoder();

export function generateToken(byteLength = defaultTokenByteLength): string {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return base64UrlEncode(bytes);
}

export async function hashSecret(secret: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", textEncoder.encode(secret));
  return `sha256.${base64UrlEncode(new Uint8Array(digest))}`;
}
