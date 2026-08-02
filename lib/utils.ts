export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function formatDateTime(value?: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function timeAgo(value?: string | null) {
  if (!value) return "—";
  const seconds = Math.floor((Date.now() - new Date(value).getTime()) / 1000);
  const intervals: Array<[number, string]> = [
    [31536000, "year"],
    [2592000, "month"],
    [604800, "week"],
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
  ];
  for (const [secondsPerUnit, label] of intervals) {
    const count = Math.floor(seconds / secondsPerUnit);
    if (count >= 1) return `${count} ${label}${count > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

export function absoluteImageUrl(src?: string | null) {
  if (!src) return undefined;
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) return src;
  return `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}${src.startsWith("/") ? "" : "/"}${src}`;
}
