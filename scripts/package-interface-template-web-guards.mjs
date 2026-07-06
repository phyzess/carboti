export async function assertTemplateAndWebApiInterfaces({ assert, templateFeature, webApi }) {
  assert(
    templateFeature.featureIntegrationFixtures[0]?.filename === "template-feature.csv" &&
      templateFeature.featureWebSurfaces[0]?.detailRoute === "/workspace/template-feature",
    "feature template must export integration fixtures and web surface descriptors.",
  );

  const structuredApiError = await webApi.apiErrorFromResponse(
    new Response(
      JSON.stringify({
        error: {
          code: "invalid_request",
          message: "Backend validation failed.",
          issues: [
            {
              message: "Email is required.",
              path: "email",
            },
          ],
        },
      }),
      {
        headers: {
          "content-type": "application/json",
        },
        status: 400,
      },
    ),
  );
  assert(
    structuredApiError instanceof webApi.ApiRequestError &&
      structuredApiError.message === "Backend validation failed." &&
      structuredApiError.code === "invalid_request" &&
      structuredApiError.issues[0]?.path === "email",
    "web API client must preserve structured backend error messages, codes, and issues.",
  );

  const fallbackApiError = await webApi.apiErrorFromResponse(
    new Response("bad gateway", {
      status: 502,
    }),
  );
  assert(
    fallbackApiError.message === "Request failed with 502" && fallbackApiError.status === 502,
    "web API client must fall back to HTTP status text for non-JSON errors.",
  );

  const networkApiError = webApi.apiNetworkError();
  assert(
    networkApiError.status === 0 && networkApiError.message.includes("Worker connection"),
    "web API client must expose a stable network-style failure message.",
  );
}
