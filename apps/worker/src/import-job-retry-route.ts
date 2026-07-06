import { requestFingerprint } from "./event-store";
import type { AppContext } from "./http-utils";
import { dispatchImportJobRetry } from "./import-job-retry-dispatch";
import { prepareImportJobRetryStatements } from "./import-job-retry-record";
import { readImportJobRetryTarget } from "./import-job-retry-target";

export async function retryImportJobResponse(context: AppContext): Promise<Response> {
  const target = await readImportJobRetryTarget(context);
  if (!target.ok) return target.response;
  const { current, job, jobId } = target;

  const now = new Date().toISOString();
  const fingerprint = await requestFingerprint(context);
  await context.env.DB.batch(
    prepareImportJobRetryStatements(context.env, {
      actorUserId: current.user.id,
      job,
      jobId,
      now,
      requestId: fingerprint.requestId,
    }),
  );

  const dispatchFailure = await dispatchImportJobRetry(context, { current, job, jobId });
  if (dispatchFailure) return dispatchFailure;

  return context.json({
    importJobId: jobId,
    status: "queued",
  });
}
