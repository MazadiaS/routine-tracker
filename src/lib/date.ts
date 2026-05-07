// All date keys use local-time YYYY-MM-DD so a "day" matches the user's wall clock.

export function isoDate(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function fromIso(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

export function startOfWeek(d: Date): Date {
  // Monday-based week
  const r = new Date(d);
  const dow = r.getDay();
  const diff = dow === 0 ? -6 : 1 - dow;
  r.setDate(r.getDate() + diff);
  r.setHours(0, 0, 0, 0);
  return r;
}

export function startOfMonth(d: Date): Date {
  const r = new Date(d.getFullYear(), d.getMonth(), 1);
  r.setHours(0, 0, 0, 0);
  return r;
}

export function endOfMonth(d: Date): Date {
  const r = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  r.setHours(23, 59, 59, 999);
  return r;
}

export function prettyDate(d: Date): string {
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function prettyTime(d: Date = new Date()): string {
  return d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}
