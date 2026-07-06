import * as v from "valibot";

export const EmailSchema = v.pipe(v.string(), v.email());
export const authPasswordPolicy = {
  minLength: 12,
} as const;
export const minimumPasswordLength = authPasswordPolicy.minLength;
export const PasswordSchema = v.pipe(
  v.string(),
  v.minLength(
    minimumPasswordLength,
    `Password must be at least ${minimumPasswordLength} characters.`,
  ),
);

export const InviteStatusSchema = v.picklist(["pending", "accepted", "expired", "revoked"]);
export const PasswordResetStatusSchema = v.picklist(["pending", "used", "expired", "revoked"]);

export const UserSchema = v.object({
  id: v.string(),
  email: EmailSchema,
  role: v.string(),
  displayName: v.optional(v.string()),
  createdAt: v.string(),
});

export const InvitationSchema = v.object({
  id: v.string(),
  email: EmailSchema,
  role: v.string(),
  status: InviteStatusSchema,
  tokenHash: v.string(),
  expiresAt: v.string(),
  createdBy: v.string(),
  createdAt: v.string(),
  acceptedAt: v.optional(v.string()),
  revokedAt: v.optional(v.string()),
});

export const PasswordCredentialSchema = v.object({
  userId: v.string(),
  passwordHash: v.string(),
  updatedAt: v.string(),
});

export const PasswordResetTokenSchema = v.object({
  id: v.string(),
  userId: v.string(),
  email: EmailSchema,
  tokenHash: v.string(),
  status: PasswordResetStatusSchema,
  expiresAt: v.string(),
  createdAt: v.string(),
  usedAt: v.optional(v.string()),
  revokedAt: v.optional(v.string()),
});

export const SessionSchema = v.object({
  id: v.string(),
  userId: v.string(),
  tokenHash: v.string(),
  expiresAt: v.string(),
  absoluteExpiresAt: v.string(),
  createdAt: v.string(),
  lastSeenAt: v.string(),
  revokedAt: v.optional(v.string()),
});

export const CreateInvitationInputSchema = v.object({
  email: EmailSchema,
  role: v.optional(v.string()),
});

export const AcceptInvitationInputSchema = v.object({
  displayName: v.optional(v.string()),
  password: PasswordSchema,
});

export const LoginInputSchema = v.object({
  email: EmailSchema,
  password: v.string(),
});

export const RequestPasswordResetInputSchema = v.object({
  email: EmailSchema,
});

export const ConfirmPasswordResetInputSchema = v.object({
  token: v.string(),
  password: PasswordSchema,
});

export type User = v.InferOutput<typeof UserSchema>;
export type InviteStatus = v.InferOutput<typeof InviteStatusSchema>;
export type PasswordResetStatus = v.InferOutput<typeof PasswordResetStatusSchema>;
export type Invitation = v.InferOutput<typeof InvitationSchema>;
export type PasswordCredential = v.InferOutput<typeof PasswordCredentialSchema>;
export type PasswordResetToken = v.InferOutput<typeof PasswordResetTokenSchema>;
export type Session = v.InferOutput<typeof SessionSchema>;
export type CreateInvitationInput = v.InferOutput<typeof CreateInvitationInputSchema>;
export type AcceptInvitationInput = v.InferOutput<typeof AcceptInvitationInputSchema>;
export type LoginInput = v.InferOutput<typeof LoginInputSchema>;
export type RequestPasswordResetInput = v.InferOutput<typeof RequestPasswordResetInputSchema>;
export type ConfirmPasswordResetInput = v.InferOutput<typeof ConfirmPasswordResetInputSchema>;
