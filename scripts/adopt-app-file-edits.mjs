import { readFileSync } from "node:fs";

export function createReplacementEdits({ files, replacements }) {
  const edits = [];

  for (const file of files) {
    const before = readFileSync(file, "utf8");
    const edit = createReplacementEdit({ before, file, replacements });
    if (edit) {
      edits.push(edit);
    }
  }

  return edits;
}

function createReplacementEdit({ before, file, replacements }) {
  let after = before;
  const labels = [];

  for (const item of replacements) {
    if (after.includes(item.from)) {
      after = after.split(item.from).join(item.to);
      labels.push(item.label);
    }
  }

  if (after === before) {
    return null;
  }

  return {
    file,
    labels: [...new Set(labels)],
    nextText: after,
  };
}
