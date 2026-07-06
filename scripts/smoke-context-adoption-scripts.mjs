export function createAdoptionScriptsContext({ text }) {
  const adoptAppScript = [
    text("scripts/adopt-app.mjs"),
    text("scripts/adopt-app-args.mjs"),
    text("scripts/adopt-app-replacements.mjs"),
    text("scripts/adopt-app-files.mjs"),
    text("scripts/adopt-app-file-apply.mjs"),
    text("scripts/adopt-app-file-collection.mjs"),
    text("scripts/adopt-app-file-edits.mjs"),
    text("scripts/adopt-app-output.mjs"),
  ].join("\n");

  return { adoptAppScript };
}
