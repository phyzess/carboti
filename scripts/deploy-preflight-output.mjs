import { deployPreflightDatabase } from "./deploy-preflight-binding-checks.mjs";
import { emailModeDefault } from "./deploy-preflight-email-checks.mjs";
import { emailDomain, isPlaceholder, stringValue } from "./deploy-preflight-policy.mjs";

export function printDeployPreflightSummary(result) {
  const publicUrl = stringValue(result.vars.PUBLIC_APP_URL) ?? "missing";
  const fromDomain = emailDomain(stringValue(result.vars.MAIL_FROM) ?? "") ?? "missing";
  const replyTo = stringValue(result.vars.MAIL_REPLY_TO);
  const mode = stringValue(result.vars.EMAIL_DELIVERY_MODE) ?? emailModeDefault(result.target);
  const db = deployPreflightDatabase(result);

  console.log(`Deploy preflight target: ${result.target}`);
  console.log(`- APP_ENV: ${result.vars.APP_ENV ?? "missing"}`);
  console.log(`- PUBLIC_APP_URL: ${publicUrl}`);
  console.log(`- EMAIL_DELIVERY_MODE: ${mode}`);
  console.log(`- MAIL_FROM domain: ${fromDomain}`);
  console.log(`- MAIL_REPLY_TO configured: ${replyTo ? "yes" : "no"}`);
  console.log(
    `- D1 database_id configured: ${db && !isPlaceholder(db.database_id) ? "yes" : "no"}`,
  );
  console.log(
    `- send_email EMAIL binding: ${
      result.sendEmail.some((binding) => binding?.name === "EMAIL") ? "yes" : "no"
    }`,
  );
}

export function printDeployPreflightWarnings(result) {
  if (result.warnings.length === 0) return;

  console.log("Warnings:");
  for (const warning of result.warnings) {
    console.log(`- ${warning}`);
  }
}

export function printDeployPreflightFailure(result) {
  console.error("Deploy preflight failed:");
  for (const error of result.errors) {
    console.error(`- ${error}`);
  }
}

export function printDeployPreflightSuccess(result) {
  console.log(`Deploy preflight passed for ${result.target}.`);
}
