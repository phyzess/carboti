import { parsedRecordsFromJson } from "./records";
import { readAll } from "./stream";
import type { JsonParsedRecord } from "./types";

export async function parseJsonSource(
  source: ReadableStream<Uint8Array>,
): Promise<JsonParsedRecord[]> {
  return parsedRecordsFromJson(JSON.parse(await readAll(source)) as unknown);
}
