import type { Hono } from "hono";
import { registerCarbotiContractRoute } from "./carboti-contract-route";

export function registerCarbotiRoutes(app: Hono<{ Bindings: Env }>): void {
  registerCarbotiContractRoute(app);
}
