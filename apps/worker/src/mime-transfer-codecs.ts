import { base64ToBytes, quotedPrintableBodyToBytes, textToBytes } from "./mime-byte-codecs";

export function decodeTransferEncodedBody(body: string, transferEncoding: string): Uint8Array {
  const normalizedBody = body.replace(/\r?\n$/, "");
  if (transferEncoding === "base64") {
    return base64ToBytes(normalizedBody.replace(/\s+/g, ""));
  }
  if (transferEncoding === "quoted-printable") {
    return quotedPrintableToBytes(normalizedBody);
  }

  return textToBytes(normalizedBody);
}

export function bytesToArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return buffer;
}

function quotedPrintableToBytes(value: string): Uint8Array {
  return quotedPrintableBodyToBytes(value.replace(/=\r?\n/g, ""));
}
