# Email Deliverability Checklist

Status: draft
Date: 2026-07-01

This checklist is business-neutral guidance for qitu apps using Cloudflare Email Service.

## 1. Domain And Sender

Before sending invitation or password-reset email outside local development:

1. Onboard the sender domain in Cloudflare Email Sending.
2. Set `EMAIL_DELIVERY_MODE=send`.
3. Set `MAIL_FROM` to an address on the verified sending domain.
4. Set `MAIL_REPLY_TO` only to an address on an approved domain.
5. Set `PUBLIC_APP_URL` to the public custom origin users should open.
6. Do not use `example.com`, localhost, or workers.dev URLs in email bodies.

Useful commands:

```sh
wrangler email sending enable example.org
wrangler email sending dns get example.org
```

Replace `example.org` with the real sending domain before running these commands.

## 2. DNS Authentication

Confirm these records before production traffic:

1. SPF authorizes Cloudflare's sending infrastructure.
2. DKIM is present and passing for the sending domain.
3. DMARC exists for the organizational domain.
4. The `From` domain aligns with the application origin or a parent domain.
5. Return-Path/bounce handling is understood for the Cloudflare Email Service account.

A starter DMARC policy for early rollout can use monitoring first, then tighten:

```text
v=DMARC1; p=none; rua=mailto:dmarc-reports@example.org
```

Move to `quarantine` or `reject` only after reviewing reports and confirming legitimate traffic.

## 3. Message Content

qitu auth email should stay transactional:

1. Include both plain text and HTML bodies.
2. Use a recognizable sender name from `PUBLIC_APP_NAME`.
3. Keep subjects honest and short.
4. Use full HTTPS links from `PUBLIC_APP_URL`.
5. Avoid temporary Worker hostnames, URL shorteners, and tracking links in auth email.
6. Do not include plaintext tokens outside the URL generated for the recipient.

## 4. Operational Checks

For an invitation that appears created but not delivered:

1. Check the invitation row in `/settings/members`.
2. Check the latest delivery badge and error summary.
3. Query `email_messages` for the invitation id in `metadata_json`.
4. If status is `failed`, fix the configuration or sender issue, then resend the invitation.
5. If status is `sent`, inspect Cloudflare Email Service analytics and recipient-side spam/quarantine.

Example D1 inspection:

```sh
wrangler d1 execute carboti-production --env production --remote --command \
  "SELECT id, status, provider, provider_message_id, error_message, created_at FROM email_messages ORDER BY created_at DESC LIMIT 20;"
```

## 5. Inbox Placement

If Outlook or another provider sends messages to spam:

1. Verify SPF, DKIM, and DMARC pass for the delivered message headers.
2. Confirm the visible `From` domain aligns with the authenticated domain.
3. Confirm the email body links use the custom application domain.
4. Confirm the recipient address is real and not suppressed after a bounce or complaint.
5. Check Cloudflare Email Service analytics for bounces, suppressions, and delivery failures.
6. Send a small number of controlled test messages before inviting a larger group.

Cloudflare manages IP reputation, DKIM signing after onboarding, retry behavior for soft bounces,
and suppression lists. The application remains responsible for correct sender configuration,
transactional content, and operational monitoring.
