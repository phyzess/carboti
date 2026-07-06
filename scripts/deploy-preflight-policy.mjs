export function stringValue(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function hostnameOf(value) {
  const text = stringValue(value);
  if (!text) return null;

  try {
    return new URL(text).hostname.toLowerCase();
  } catch {
    return null;
  }
}

export function emailDomain(value) {
  const domain = value.split("@")[1]?.toLowerCase();
  return domain && /^[^\s@]+\.[^\s@]+$/.test(domain) ? domain : null;
}

export function domainsAlign(hostname, emailDomainValue) {
  return (
    hostname === emailDomainValue ||
    hostname.endsWith(`.${emailDomainValue}`) ||
    emailDomainValue.endsWith(`.${hostname}`)
  );
}

export function isPlaceholder(value) {
  return (
    !value || value === "00000000-0000-0000-0000-000000000000" || value.includes("REPLACE_WITH")
  );
}

export function isExampleDomain(hostname) {
  return hostname === "example.com" || hostname.endsWith(".example.com");
}

export function isLocalHostname(hostname) {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1" ||
    hostname === "[::1]" ||
    hostname.endsWith(".localhost")
  );
}

export function isWorkersDev(hostname) {
  return hostname === "workers.dev" || hostname.endsWith(".workers.dev");
}
