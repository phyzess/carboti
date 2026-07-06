export function extractMessageKeys(source, marker) {
  const block = extractObjectBlock(source, marker);
  return extractQuotedObjectKeys(block);
}

export function extractMessageKeysFromSources(sources) {
  return sources.flatMap((source) => extractQuotedObjectKeys(source));
}

function extractQuotedObjectKeys(source) {
  const keys = [];
  const pattern = /"([^"]+)":/g;
  let match;

  while ((match = pattern.exec(source))) {
    keys.push(match[1]);
  }

  return keys;
}

function extractObjectBlock(source, marker) {
  const markerIndex = source.indexOf(marker);
  if (markerIndex === -1) {
    throw new Error(`Missing marker: ${marker}`);
  }

  const start = source.indexOf("{", markerIndex);
  if (start === -1) {
    throw new Error(`Missing object start after marker: ${marker}`);
  }

  let depth = 0;
  let quote = null;
  let escaped = false;

  for (let index = start; index < source.length; index += 1) {
    const char = source[index];

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        quote = null;
      }
      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }

    if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return source.slice(start, index + 1);
      }
    }
  }

  throw new Error(`Unclosed object after marker: ${marker}`);
}
