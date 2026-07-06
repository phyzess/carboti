import { assertWebRuntimeApiGuards } from "./smoke-web-runtime-api-guards.mjs";
import { assertWebRuntimeAuthGuards } from "./smoke-web-runtime-auth-guards.mjs";
import { assertWebRuntimeProxyGuards } from "./smoke-web-runtime-proxy-guards.mjs";
import { assertWebRuntimeSurfaceGuards } from "./smoke-web-runtime-surface-guards.mjs";

export function assertWebRuntimeGuards(context) {
  assertWebRuntimeAuthGuards(context);
  assertWebRuntimeProxyGuards(context);
  assertWebRuntimeApiGuards(context);
  assertWebRuntimeSurfaceGuards(context);
}
