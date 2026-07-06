export type AuthRoute =
  | {
      kind: "home";
    }
  | {
      kind: "invite";
      token: string;
    }
  | {
      kind: "reset";
      token: string;
    };

export function authRouteFromPath(pathname: string): AuthRoute {
  const segments = pathname.split("/").filter(Boolean);
  const [kind, token] = segments;

  if (kind === "invite" && token) {
    return {
      kind: "invite",
      token: decodeURIComponent(token),
    };
  }

  if (kind === "reset-password" && token) {
    return {
      kind: "reset",
      token: decodeURIComponent(token),
    };
  }

  return {
    kind: "home",
  };
}
