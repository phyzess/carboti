import type { Session, User } from "@carboti/auth";
import type { LocalUserBootstrapOptions } from "./auth-local-bootstrap-types";
import type { RequestFingerprint } from "./event-store";

export type LocalUserBootstrapStatementInput = {
  created: boolean;
  emailHash: string;
  fingerprint: RequestFingerprint;
  now: string;
  options: LocalUserBootstrapOptions;
  passwordHash: string;
  session: Session;
  user: User;
};
