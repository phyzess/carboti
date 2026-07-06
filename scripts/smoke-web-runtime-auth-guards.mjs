export function assertWebRuntimeAuthGuards(context) {
  const { assert, webAppControllerRouteGateProps, webAppSession, webSources } = context;

  const defaultAuthFormSource =
    webAppSession.match(/const defaultAuthForm[\s\S]*?= \{[\s\S]*?\};/)?.[0] ?? "";
  assert(
    defaultAuthFormSource.includes('email: ""') &&
      defaultAuthFormSource.includes('password: ""') &&
      !defaultAuthFormSource.includes("reviewer@example.com") &&
      webSources.includes('runtimeEnvironment === "local"') &&
      webSources.includes('props.authMode === "setup" && props.localSetupAvailable') &&
      webAppControllerRouteGateProps.includes("selectAuthMode"),
    "production auth UI must not prefill demo credentials and setup UI must be gated by local runtime.",
  );
}
