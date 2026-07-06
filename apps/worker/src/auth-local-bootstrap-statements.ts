import { prepareLocalUserBootstrapAccountStatements } from "./auth-local-bootstrap-account-statements";
import { prepareLocalUserBootstrapSessionStatements } from "./auth-local-bootstrap-session-statements";
import type { LocalUserBootstrapStatementInput } from "./auth-local-bootstrap-statement-types";
export type { LocalUserBootstrapStatementInput } from "./auth-local-bootstrap-statement-types";

export function prepareLocalUserBootstrapStatements(
  env: Env,
  input: LocalUserBootstrapStatementInput,
): D1PreparedStatement[] {
  return [
    ...prepareLocalUserBootstrapAccountStatements(env, input),
    ...prepareLocalUserBootstrapSessionStatements(env, input),
  ];
}
