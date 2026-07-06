import * as v from "valibot";

export const ImportJobMessageSchema = v.object({
  kind: v.literal("import.source_file"),
  jobId: v.string(),
  sourceFileId: v.string(),
  objectKey: v.string(),
  requestedBy: v.string(),
});

export type ImportJobMessage = v.InferOutput<typeof ImportJobMessageSchema>;

export function parseImportJobMessage(input: unknown): ImportJobMessage {
  return v.parse(ImportJobMessageSchema, input);
}
