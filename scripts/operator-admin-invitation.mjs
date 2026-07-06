import process from "node:process";

import { runAdminInvitationCommand } from "./operator-admin-invitation-runner.mjs";

try {
  await runAdminInvitationCommand({
    args: process.argv.slice(2),
  });
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
