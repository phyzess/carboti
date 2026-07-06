export async function readExistingInvitationUser(
  env: Env,
  email: string,
): Promise<{ id: string } | null> {
  return env.DB.prepare("SELECT id FROM users WHERE email = ? LIMIT 1")
    .bind(email)
    .first<{ id: string }>();
}
