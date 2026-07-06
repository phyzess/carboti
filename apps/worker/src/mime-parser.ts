import { bytesToArrayBuffer, decodeHeaderValue, decodeTransferEncodedBody } from "./mime-codecs";
import {
  boundaryFromContentType,
  headerValue,
  parameterFromHeader,
  parseMimeHeaders,
  type MimeHeaders,
} from "./mime-headers";

export type ParsedAttachment = {
  content: ArrayBuffer;
  contentType: string;
  filename: string;
  size: number;
};

export function parseMimeAttachments(rawEmail: string): ParsedAttachment[] {
  return collectAttachments(parseMimeEntity(rawEmail));
}

type MimeEntity = {
  body: string;
  headers: MimeHeaders;
};

function collectAttachments(entity: MimeEntity): ParsedAttachment[] {
  const contentType = headerValue(entity.headers, "content-type");
  const boundary = boundaryFromContentType(contentType);
  if (boundary) {
    return splitMultipartBody(entity.body, boundary).flatMap((part) =>
      collectAttachments(parseMimeEntity(part)),
    );
  }

  const disposition = headerValue(entity.headers, "content-disposition");
  if (!/attachment/i.test(disposition)) return [];

  const transferEncoding = headerValue(entity.headers, "content-transfer-encoding").toLowerCase();
  const bytes = decodeTransferEncodedBody(entity.body, transferEncoding);
  const filename =
    parameterFromHeader(disposition, "filename") ??
    parameterFromHeader(contentType, "name") ??
    "attachment.bin";

  return [
    {
      content: bytesToArrayBuffer(bytes),
      contentType: contentType.split(";")[0]?.trim() || "application/octet-stream",
      filename: decodeHeaderValue(filename),
      size: bytes.byteLength,
    },
  ];
}

function parseMimeEntity(raw: string): MimeEntity {
  const separator = raw.includes("\r\n\r\n") ? "\r\n\r\n" : "\n\n";
  const separatorIndex = raw.indexOf(separator);
  if (separatorIndex < 0) {
    return {
      body: "",
      headers: parseMimeHeaders(raw),
    };
  }

  return {
    body: raw.slice(separatorIndex + separator.length),
    headers: parseMimeHeaders(raw.slice(0, separatorIndex)),
  };
}

function splitMultipartBody(body: string, boundary: string): string[] {
  const marker = `--${boundary}`;
  const sections = body.split(marker).slice(1);
  const parts: string[] = [];

  for (const section of sections) {
    if (section.startsWith("--")) break;

    const part = section.replace(/^\r?\n/, "").replace(/\r?\n$/, "");
    if (part.trim()) {
      parts.push(part);
    }
  }

  return parts;
}
