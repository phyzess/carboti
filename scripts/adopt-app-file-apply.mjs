import { rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export function applyAdoptionPlan({ edits, removals, root }) {
  for (const edit of edits) {
    writeFileSync(edit.file, edit.nextText);
  }

  for (const path of removals) {
    rmSync(join(root, path), { force: true, recursive: true });
  }
}
