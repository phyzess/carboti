export function printDoctorReport({ errors, notes, warnings }) {
  console.log("qitu doctor\n");

  for (const note of notes) console.log(`note: ${note}`);
  for (const warning of warnings) console.warn(`warn: ${warning}`);
  for (const error of errors) console.error(`error: ${error}`);

  if (errors.length > 0) {
    console.error(`\nDoctor failed with ${errors.length} error(s).`);
    return false;
  }

  console.log("\nDoctor passed.");
  return true;
}
