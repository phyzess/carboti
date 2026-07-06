export function localD1MigrationSucceeded(
  recentOutput,
  { finalMigrationName, noMigrationsMarker },
) {
  if (recentOutput.includes(noMigrationsMarker)) {
    return true;
  }

  return recentOutput
    .split(/\r?\n/)
    .some((line) => line.includes(finalMigrationName) && line.includes("\u2705"));
}
