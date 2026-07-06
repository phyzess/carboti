export async function assertExampleFeatureInterfaces({
  assert,
  exampleImportReview,
  exampleJsonRecords,
}) {
  const textParsed = await exampleImportReview.exampleImportReviewAdapter.parse(
    streamFromText("label,value\nAlpha,42\nBroken,nope"),
  );
  const textStaged = await exampleImportReview.exampleImportReviewAdapter.stage(textParsed);
  const textCommitted = await exampleImportReview.exampleImportReviewAdapter.commitApproved({
    context: commitContext(),
    records: [textStaged[0]],
  });

  assert(
    textParsed.length === 2 &&
      textStaged[0]?.normalizedLabel === "alpha" &&
      exampleImportReview.parseExampleStagedRecord(textStaged[0]).value === 42 &&
      exampleImportReview.exampleImportReviewAdapter.validate(textStaged[1])[0]?.code ===
        "invalid_number" &&
      textCommitted[0]?.committedAt,
    "example import-review adapter must parse, stage, validate, and commit independently of the Worker starter adapter.",
  );

  const jsonParsed = await exampleJsonRecords.jsonRecordsAdapter.parse(
    streamFromText(JSON.stringify([{ key: "Primary", value: { enabled: true } }, 7])),
  );
  const jsonStaged = await exampleJsonRecords.jsonRecordsAdapter.stage(jsonParsed);
  const jsonCommitted = await exampleJsonRecords.jsonRecordsAdapter.commitApproved({
    context: commitContext(),
    records: [jsonStaged[0]],
  });
  const emptyKeyStaged = (
    await exampleJsonRecords.jsonRecordsAdapter.stage(
      await exampleJsonRecords.jsonRecordsAdapter.parse(streamFromText(JSON.stringify({ "": 1 }))),
    )
  )[0];

  assert(
    jsonParsed[1]?.key === "2" &&
      jsonStaged[0]?.normalizedKey === "primary" &&
      jsonStaged[0]?.valueType === "object" &&
      exampleJsonRecords.parseJsonStagedRecord(jsonStaged[0]).sourcePath === "$[0]" &&
      jsonCommitted[0]?.commitKey === "job-1:primary" &&
      exampleJsonRecords.jsonRecordsAdapter.validate(emptyKeyStaged)[0]?.code === "empty_key",
    "example json-records adapter must parse, stage, validate, and commit independently of the Worker starter adapter.",
  );
}

function commitContext() {
  return {
    approvedStagedRecordKeys: ["primary"],
    idempotencyKey: "idem-1",
    importJobId: "job-1",
    reviewerId: "reviewer-1",
  };
}

function streamFromText(value) {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(value));
      controller.close();
    },
  });
}
