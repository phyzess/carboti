const defaultWriteLine = (line) => {
  console.log(line);
};

export function printInvitationSummary({ invitation, target, writeLine = defaultWriteLine }) {
  writeLine(`Target: ${target}`);
  writeLine(`Email: ${invitation.email}`);
  writeLine("Role: admin");
  writeLine(`Expires: ${invitation.expiresAt}`);
}

export function printDryRunNotice({ writeLine = defaultWriteLine } = {}) {
  writeLine("Dry run complete. No invitation was written and no usable token was printed.");
}

export function printInvitationCreated({ invitation, writeLine = defaultWriteLine }) {
  writeLine("Admin invitation created.");
  writeLine(
    "Treat this one-time invitation URL as a secret and send it through a private channel:",
  );
  writeLine(invitation.inviteUrl);
}
