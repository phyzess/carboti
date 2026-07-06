export function assertAuthAndDbInterfaces({ assert, auth, db }) {
  assert(
    auth.minimumPasswordLength === 12 &&
      auth.authPasswordPolicy.minLength === auth.minimumPasswordLength,
    "auth package must expose shared password policy constants.",
  );
  assert(
    typeof db.users.role === "object" &&
      typeof db.passwordResetTokens.tokenHash === "object" &&
      typeof db.emailMessages.providerMessageId === "object" &&
      typeof db.inboundEmailMessages.rawObjectKey === "object" &&
      typeof db.inboundEmailAttachments.sourceFileId === "object",
    "db package must expose the current auth/email migration baseline.",
  );
}
