import { readAll } from "./stream";
import type { ExampleParsedRecord } from "./types";

export async function parseExampleSource(
  source: ReadableStream<Uint8Array>,
): Promise<ExampleParsedRecord[]> {
  const text = await readAll(source);
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line, index) => {
      if (index !== 0) return true;
      return line.toLowerCase() !== "label,value";
    })
    .map((line) => {
      const [label = "", value = "0"] = line.split(",");
      return { label, value: Number(value) };
    });
}
