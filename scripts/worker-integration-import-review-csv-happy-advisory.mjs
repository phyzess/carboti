import { assert } from "./worker-integration-http.mjs";

export async function confirmCsvAdvisory({ client, importJobId }) {
  const advisory = await client.json(`/api/import-jobs/${importJobId}/advisories`, {
    method: "POST",
  });
  assert(advisory.advisory.status === "suggested", "AI advisory starts as suggested");
  assert(
    advisory.advisory.output?.humanGate === "Human confirmation is still required before commit.",
    "AI advisory records the human confirmation gate",
  );

  const advisoryList = await client.json(`/api/import-jobs/${importJobId}/advisories`);
  assert(advisoryList.advisories.length === 1, "AI advisory list returns generated advisory");

  const confirmedAdvisory = await client.json(
    `/api/import-jobs/${importJobId}/advisories/${advisory.advisory.id}/confirm`,
    {
      method: "POST",
    },
  );
  assert(confirmedAdvisory.advisory.status === "confirmed", "AI advisory can be human-confirmed");
}
