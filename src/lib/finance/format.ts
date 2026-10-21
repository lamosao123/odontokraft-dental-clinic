export function round2(n: number) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function num(value: unknown) {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function ymd(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function currentMonth() {
  return ymd(new Date()).slice(0, 7);
}

export function shiftDay(iso: string, delta: number) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, (m ?? 1) - 1, (d ?? 1) + delta);
  return ymd(date);
}

export function shiftMonth(ym: string, delta: number) {
  const [y, m] = ym.split("-").map(Number);
  const date = new Date(y, (m ?? 1) - 1 + delta, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function monthsInRange(anchor: string, mode: "month" | "quarter" | "year") {
  if (mode === "month") return [anchor];
  if (mode === "year") {
    const year = anchor.slice(0, 4);
    return Array.from({ length: 12 }, (_, i) => `${year}-${String(i + 1).padStart(2, "0")}`);
  }
  return [2, 1, 0].map((back) => shiftMonth(anchor, -back));
}

export function trailingMonths(anchor: string, count: number) {
  return Array.from({ length: count }, (_, i) => shiftMonth(anchor, i - (count - 1)));
}

export function prettyMonth(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, 1).toLocaleDateString("en-PH", {
    month: "long",
    year: "numeric",
  });
}

export function shortMonth(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, 1).toLocaleDateString("en-PH", { month: "short" });
}

export function prettyDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1).toLocaleDateString("en-PH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function chartDay(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1).toLocaleDateString("en-PH", {
    day: "numeric",
    month: "short",
  });
}

export function peso(value: number) {
  const rounded = round2(num(value));
  const hasCents = Math.abs(rounded % 1) > 0.001;
  const formatted = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: hasCents ? 2 : 0,
  }).format(Math.abs(rounded));
  return rounded < 0 ? `−${formatted}` : formatted;
}

export function pesoCompact(value: number) {
  const n = num(value);
  const sign = n < 0 ? "−" : "";
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `${sign}₱${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 10_000) return `${sign}₱${Math.round(abs / 1000)}k`;
  if (abs >= 1000) return `${sign}₱${(abs / 1000).toFixed(1)}k`;
  return `${sign}₱${Math.round(abs)}`;
}

export function pct(ratio: number | null) {
  if (ratio == null || !Number.isFinite(ratio)) return "—";
  return `${(ratio * 100).toFixed(1)}%`;
}

export function deltaText(current: number, previous: number) {
  if (!previous) return null;
  const change = (current - previous) / Math.abs(previous);
  const rounded = Math.round(change * 100);
  if (rounded === 0) return "Flat vs prior period";
  return `${rounded > 0 ? "+" : ""}${rounded}% vs prior period`;
}

export function defaultEntryDate(anchor: string) {
  const today = ymd(new Date());
  if (today.startsWith(anchor)) return today;
  const [y, m] = anchor.split("-").map(Number);
  const last = new Date(y, m, 0).getDate();
  const end = `${anchor}-${String(last).padStart(2, "0")}`;
  if (anchor > today.slice(0, 7)) return `${anchor}-01`;
  return end;
}

export function uid(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}
