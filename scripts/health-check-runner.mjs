class HealthCheckFailure extends Error {}

export async function runHealthCheck({
  expectedEnvironment,
  fetchImpl = fetch,
  healthUrl,
  timeoutMs,
}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchImpl(healthUrl, {
      headers: { accept: "application/json" },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new HealthCheckFailure(
        `Health check failed with HTTP ${response.status} from ${healthUrl}.`,
      );
    }

    const body = await parseHealthJson(response);
    assertHealthContract({ body, expectedEnvironment });
    return body;
  } catch (error) {
    if (error instanceof HealthCheckFailure) {
      throw error;
    }

    if (error?.name === "AbortError") {
      throw new Error(`Health check timed out after ${timeoutMs}ms for ${healthUrl}.`);
    }

    throw new Error(`Health check request failed for ${healthUrl}: ${error.message}`);
  } finally {
    clearTimeout(timeout);
  }
}

async function parseHealthJson(response) {
  return await response.json();
}

function assertHealthContract({ body, expectedEnvironment }) {
  if (body?.ok !== true || body?.service !== "carboti-worker") {
    throw new HealthCheckFailure("Health check response did not match the qitu Worker contract.");
  }

  if (expectedEnvironment && body.environment !== expectedEnvironment) {
    throw new HealthCheckFailure(
      `Health check expected APP_ENV=${expectedEnvironment} but received APP_ENV=${body.environment}.`,
    );
  }
}
