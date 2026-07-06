import {
  domainsAlign,
  emailDomain,
  hostnameOf,
  isExampleDomain,
  stringValue,
} from "./deploy-preflight-policy.mjs";

export function checkEmailConfig(result) {
  const mode = stringValue(result.vars.EMAIL_DELIVERY_MODE) ?? emailModeDefault(result.target);
  if (result.target !== "local" && mode !== "send") {
    result.errors.push("EMAIL_DELIVERY_MODE must be send outside local development.");
  }

  const mailFrom = stringValue(result.vars.MAIL_FROM);
  if (!mailFrom) {
    result.errors.push("MAIL_FROM is required.");
    return;
  }

  const fromDomain = emailDomain(mailFrom);
  if (!fromDomain) {
    result.errors.push("MAIL_FROM must be a valid email address.");
    return;
  }

  if (result.target !== "local" && isExampleDomain(fromDomain)) {
    result.errors.push("MAIL_FROM must use a verified Cloudflare Email sender domain.");
  }

  const appHostname = hostnameOf(result.vars.PUBLIC_APP_URL);
  if (result.target !== "local" && appHostname && !domainsAlign(appHostname, fromDomain)) {
    result.warnings.push(
      `MAIL_FROM domain ${fromDomain} does not obviously align with PUBLIC_APP_URL host ${appHostname}.`,
    );
  }

  const replyTo = stringValue(result.vars.MAIL_REPLY_TO);
  if (replyTo) {
    const replyDomain = emailDomain(replyTo);
    if (!replyDomain) {
      result.errors.push("MAIL_REPLY_TO must be empty or a valid email address.");
    } else if (result.target !== "local" && isExampleDomain(replyDomain)) {
      result.errors.push("MAIL_REPLY_TO must not use example.com outside local development.");
    }
  }
}

export function emailModeDefault(target) {
  return target === "local" ? "store" : "send";
}
