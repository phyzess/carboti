export function assertI18nAndRbacInterfaces({ assert, i18n, rbac }) {
  const localeFormatters = i18n.createLocaleFormatters({
    intlLocale: "en-GB",
  });
  assert(
    localeFormatters.formatPlural(2, {
      one: "{count} item",
      other: "{count} items",
    }) === "2 items",
    "i18n package must format plural messages.",
  );
  assert(
    localeFormatters.formatRelativeTime(-1, "day") === "yesterday",
    "i18n package must format relative time.",
  );
  assert(
    i18n.resolveLocale({
      candidates: i18n.localeCandidatesFromAcceptLanguage("zh-CN, en;q=0.8"),
      defaultLocale: "en",
      localeOptions: [
        {
          id: "en",
          label: "English",
          shortLabel: "EN",
          htmlLang: "en",
          intlLocale: "en-GB",
        },
        {
          id: "zh-CN",
          label: "Simplified Chinese",
          shortLabel: "ZH",
          htmlLang: "zh-CN",
          intlLocale: "zh-CN",
        },
      ],
    }) === "zh-CN",
    "i18n package must resolve locales from Accept-Language candidates.",
  );

  const customPolicy = rbac.createRbacPolicy({
    fallbackRole: "viewer",
    permissions: {
      operator: ["source_file:upload", "review:decide"],
      viewer: [],
    },
    roles: ["operator", "viewer"],
  });
  assert(
    rbac.normalizeRoleForPolicy(customPolicy, "missing") === "viewer" &&
      rbac.can({ id: "user-1", role: "operator" }, "review:decide", customPolicy) === true &&
      rbac.can({ id: "user-2", role: "viewer" }, "review:decide", customPolicy) === false,
    "rbac package must let app-owned role policies use product-owned role names without changing the package.",
  );
}
