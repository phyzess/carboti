export function cookieHeader(jar) {
  if (jar.size === 0) {
    return "";
  }

  return Array.from(jar.entries())
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");
}

export function storeResponseCookies(jar, response) {
  const setCookie = response.headers.get("set-cookie");
  if (!setCookie) {
    return;
  }

  for (const cookie of splitSetCookie(setCookie)) {
    const [pair] = cookie.split(";");
    const separator = pair.indexOf("=");
    if (separator === -1) {
      continue;
    }

    const name = pair.slice(0, separator).trim();
    const value = pair.slice(separator + 1).trim();
    if (!name) {
      continue;
    }

    if (value) {
      jar.set(name, value);
    } else {
      jar.delete(name);
    }
  }
}

function splitSetCookie(header) {
  return header.split(/,(?=\s*[^;,]+=)/g).map((value) => value.trim());
}
