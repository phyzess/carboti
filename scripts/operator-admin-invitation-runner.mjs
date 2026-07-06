import { parseArgs } from "./operator-admin-invitation-args.mjs";
import { createAdminInvitation } from "./operator-admin-invitation-build.mjs";
import { runD1 } from "./operator-admin-invitation-d1.mjs";
import {
  printDryRunNotice,
  printInvitationCreated,
  printInvitationSummary,
} from "./operator-admin-invitation-output.mjs";
import { insertInvitationSql } from "./operator-admin-invitation-sql.mjs";
import { resolveAdminInvitationRequest } from "./operator-admin-invitation-validation.mjs";

export async function runAdminInvitationCommand({ args, writeLine } = {}) {
  const options = parseArgs(args ?? []);
  const request = resolveAdminInvitationRequest(options);
  const invitation = await createAdminInvitation({
    appUrl: request.appUrl,
    createdBy: request.createdBy,
    email: request.email,
    expiresDays: request.expiresDays,
  });

  printInvitationSummary({
    invitation,
    target: request.target,
    writeLine,
  });

  if (request.dryRun) {
    printDryRunNotice({ writeLine });
    return {
      dryRun: true,
      invitation,
      request,
    };
  }

  await runD1(request.config, insertInvitationSql(invitation));
  printInvitationCreated({
    invitation,
    writeLine,
  });

  return {
    dryRun: false,
    invitation,
    request,
  };
}
