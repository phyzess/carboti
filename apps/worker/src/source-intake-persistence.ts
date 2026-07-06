import { prepareSourceFileImportJobInserts } from "./source-intake-store";
import type { SourceFileImportJobInsertInput } from "./source-intake-store";

export type PersistSourceFileImportJobInput = SourceFileImportJobInsertInput & {
  content: ArrayBuffer;
};

export async function persistSourceFileImportJob(
  env: Env,
  input: PersistSourceFileImportJobInput,
): Promise<void> {
  await env.SOURCE_FILES.put(input.objectKey, input.content, {
    customMetadata: {
      contentHash: input.contentHash,
      uploadedBy: input.actor.id,
    },
    httpMetadata: {
      contentType: input.contentType,
    },
  });

  try {
    await env.DB.batch(prepareSourceFileImportJobInserts(env, input));
  } catch (error) {
    await env.SOURCE_FILES.delete(input.objectKey);
    throw error;
  }
}
