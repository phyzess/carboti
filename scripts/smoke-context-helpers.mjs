export function collectMatches(source, pattern) {
  const values = new Set();
  for (const match of source.matchAll(pattern)) {
    values.add(match[1]);
  }
  return values;
}

export function forbiddenTerm(...parts) {
  return new RegExp(`\\b${parts.join("")}\\b`, "i");
}

export function caseSensitiveForbiddenTerm(...parts) {
  return new RegExp(`\\b${parts.join("")}\\b`);
}
