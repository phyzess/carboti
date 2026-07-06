export function nowIso(): string {
  return new Date().toISOString();
}

export function oneDayFromNow(): string {
  return new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
}

export function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

export function hoursFrom(value: string, hours: number): string {
  return new Date(new Date(value).getTime() + hours * 60 * 60 * 1000).toISOString();
}
