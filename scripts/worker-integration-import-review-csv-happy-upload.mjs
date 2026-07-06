import { assert } from "./worker-integration-http.mjs";

const csvFixtureBody = "label,value\nSample Record,1.1992\n";
const csvFixtureHeaders = {
  "content-type": "text/plain",
  "x-filename": "fixture-import.txt",
  "x-workspace-id": "default",
};

export async function uploadCsvHappyPathFixture({ client, env }) {
  const upload = await client.json("/api/source-files", {
    method: "POST",
    body: csvFixtureBody,
    headers: csvFixtureHeaders,
  });

  assert(upload.status === "queued", "upload creates queued import job");
  assert(env.SOURCE_FILES.has(upload.objectKey), "upload writes R2 object");
  assert(env.IMPORT_JOBS.messages.length === 1, "upload dispatches queue message");

  const duplicate = await client.json("/api/source-files", {
    method: "POST",
    body: csvFixtureBody,
    headers: csvFixtureHeaders,
  });

  assert(duplicate.duplicate === true, "duplicate upload is idempotent");
  assert(env.IMPORT_JOBS.messages.length === 1, "duplicate upload does not dispatch queue message");

  return upload;
}
