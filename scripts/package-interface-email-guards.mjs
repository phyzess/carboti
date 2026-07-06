export function assertEmailInterfaces({ assert, email }) {
  const invitation = email.renderInvitationEmail({
    appName: "Qitu",
    email: "reviewer@example.com",
    locale: "zh-CN",
    url: "https://app.example.test/invite?token=abc&locale=zh-CN",
  });

  assert(
    email.EmailMessageSchema &&
      email.InboundEmailReceiptSchema &&
      email.InboundEmailAttachmentSchema,
    "email package must expose provider-neutral message and inbound receipt schemas.",
  );
  assert(
    invitation.subject.includes("Qitu") &&
      invitation.text.includes("https://app.example.test/invite?token=abc&locale=zh-CN") &&
      invitation.html.includes("&amp;locale=zh-CN"),
    "email package must render localized auth emails and escape HTML links.",
  );
}
