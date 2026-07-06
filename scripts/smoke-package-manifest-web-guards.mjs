export function assertPackageManifestWebGuards(context) {
  const { assert, webPackage } = context;

  assert(
    webPackage.dependencies["@carboti/auth"] === "workspace:*" &&
      webPackage.dependencies["@carboti/charts"] === "workspace:*",
    "web app must depend on shared auth policy and charts packages.",
  );
}
