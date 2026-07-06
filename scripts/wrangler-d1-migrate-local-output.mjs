import { localD1MigrationSucceeded } from "./wrangler-d1-migrate-local-success.mjs";

export function createLocalD1MigrationOutputTracker({ finalMigrationName, noMigrationsMarker }) {
  let markerSeen = false;
  let recentOutput = "";

  return {
    handleOutput(chunk, stream) {
      const text = chunk.toString();
      stream.write(chunk);
      recentOutput = `${recentOutput}${text}`.slice(-10_000);

      if (
        !markerSeen &&
        localD1MigrationSucceeded(recentOutput, { finalMigrationName, noMigrationsMarker })
      ) {
        markerSeen = true;
      }

      return markerSeen;
    },
    markerSeen() {
      return markerSeen;
    },
  };
}
