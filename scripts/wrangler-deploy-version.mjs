export function findWorkerVersionId(output) {
  const patterns = [
    /\bWorker version id:\s*([a-f0-9-]{16,})\b/i,
    /\bVersion ID:\s*([a-f0-9-]{16,})\b/i,
    /\bversion[_ ]id["':=\s]+([a-f0-9-]{16,})\b/i,
  ];

  for (const pattern of patterns) {
    const match = output.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
}
