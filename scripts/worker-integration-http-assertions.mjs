export async function expectStatus(response, status) {
  assert(response.status === status, `expected ${status}, got ${response.status}`);
}

export async function expectApiError(response, status, code) {
  await expectStatus(response, status);
  const body = await response.json();
  assert(body?.error?.code === code, `expected API error code ${code}`);
}

export function assert(condition, message) {
  if (!condition) {
    throw new Error(`integration: ${message}`);
  }
}
