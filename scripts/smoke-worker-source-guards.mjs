export function assertWorkerSourceGuards(context) {
  const { assert, workerSourceIntake, workerSourceIntakeStore, workerSourceRoutes, workerSources } =
    context;

  assert(
    workerSources.includes("readCurrentUser(context)") &&
      workerSources.includes("INSERT INTO source_files") &&
      workerSources.includes("INSERT INTO import_jobs"),
    "source file intake must require a current user and write source_files/import_jobs.",
  );
  assert(
    workerSources.includes('action: "source_file.uploaded"') &&
      workerSources.includes('action: "import_job.queued"'),
    "source file intake must write upload and import job audit events.",
  );
  assert(
    workerSourceIntake.includes("hashSourceContent(input.content)") &&
      workerSourceIntakeStore.includes("findDuplicateSourceFile") &&
      workerSourceIntake.includes("import_job.dispatch_failed"),
    "source file intake must include content hash idempotency and queue dispatch failure handling.",
  );
  assert(
    workerSourceRoutes.includes("readSourceFiles") &&
      workerSourceRoutes.includes("publicSourceFile") &&
      workerSourceRoutes.includes("readSourceUploadRequest") &&
      workerSourceRoutes.includes("sourceUploadResultResponse"),
    "source routes must keep list SQL, public projection, upload request parsing, and intake result projection in focused support modules.",
  );
}
