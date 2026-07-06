import process from "node:process";

import { createAdoptionOptions } from "./adopt-app-args.mjs";
import { applyAdoptionPlan, collectTextFiles, createReplacementEdits } from "./adopt-app-files.mjs";
import {
  printApplySummary,
  printDryRunNotice,
  printPlan,
  printRemoteSafetySteps,
} from "./adopt-app-output.mjs";
import { cleanupPaths, createReplacements } from "./adopt-app-replacements.mjs";

const root = process.cwd();
const options = createAdoptionOptions(process.argv.slice(2));
const replacements = createReplacements(options);
const files = collectTextFiles(root);
const edits = createReplacementEdits({ files, replacements });
const removals = options.cleanProductBaseline
  ? cleanupPaths.filter((path) => options.exists(path))
  : [];

printPlan({ edits, options, removals, root });

if (options.apply) {
  applyAdoptionPlan({ edits, removals, root });
  printApplySummary({ edits, removals });
} else {
  printDryRunNotice();
}

printRemoteSafetySteps(options);
