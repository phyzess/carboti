export function assertUiTokenGuards(context) {
  const {
    assert,
    chartsPackage,
    collectMatches,
    designTokens,
    uiSources,
    uiStyles,
    webSources,
    webStyles,
  } = context;

  const qituTokenDefinitions = collectMatches(
    [designTokens, uiStyles, webStyles].join("\n"),
    /(--qitu-[A-Za-z0-9_-]+)\s*:/g,
  );
  const qituTokenUsages = collectMatches(
    [designTokens, uiStyles, webStyles, uiSources, webSources, chartsPackage].join("\n"),
    /var\((--qitu-[A-Za-z0-9_-]+)/g,
  );
  const undefinedQituTokens = [...qituTokenUsages].filter(
    (token) => !qituTokenDefinitions.has(token),
  );

  assert(
    undefinedQituTokens.length === 0,
    `all consumed qitu CSS tokens must be defined. Missing: ${undefinedQituTokens.join(", ")}`,
  );
  assert(
    designTokens.includes("--qitu-chroma-active") &&
      uiStyles.includes("background: var(--qitu-chroma-active);") &&
      uiStyles.includes("box-shadow: inset 0 -1px 0 var(--qitu-chroma-active);"),
    "qitu active navigation indicators must use the canonical --qitu-chroma-active token.",
  );
}
