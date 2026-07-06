const sessionRollingDays = 7;
const sessionAbsoluteDays = 30;
const passwordResetMinutes = 30;

export function createInviteExpiry(now = new Date(), days = 1): string {
  const expiresAt = new Date(now);
  expiresAt.setDate(expiresAt.getDate() + days);
  return expiresAt.toISOString();
}

export function createPasswordResetExpiry(
  now = new Date(),
  minutes = passwordResetMinutes,
): string {
  const expiresAt = new Date(now);
  expiresAt.setMinutes(expiresAt.getMinutes() + minutes);
  return expiresAt.toISOString();
}

export function createRollingSessionExpiry(now = new Date(), days = sessionRollingDays): string {
  const expiresAt = new Date(now);
  expiresAt.setDate(expiresAt.getDate() + days);
  return expiresAt.toISOString();
}

export function createAbsoluteSessionExpiry(now = new Date(), days = sessionAbsoluteDays): string {
  const expiresAt = new Date(now);
  expiresAt.setDate(expiresAt.getDate() + days);
  return expiresAt.toISOString();
}

export function isExpired(expiresAt: string, now = new Date()): boolean {
  return new Date(expiresAt).getTime() <= now.getTime();
}
