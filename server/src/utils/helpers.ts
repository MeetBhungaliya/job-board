export function toIsoString(value: unknown): string | undefined {
  if (!value) return undefined;

  if (typeof value === "string") return value;

  if (value instanceof Date) return value.toISOString();

  try {
    const d = new Date(value as any);
    if (!isNaN(d.getTime())) return d.toISOString();
  } catch {}

  return undefined;
}