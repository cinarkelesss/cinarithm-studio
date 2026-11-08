const ONE_DAY = 24 * 60 * 60 * 1000;

function normalize(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function toDateKey(date = new Date()) {
  const normalized = normalize(date);
  const year = normalized.getFullYear();
  const month = String(normalized.getMonth() + 1).padStart(2, "0");
  const day = String(normalized.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function fromDateKey(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function shiftDays(date: Date, amount: number) {
  const shifted = new Date(normalize(date).getTime() + amount * ONE_DAY);
  return shifted;
}

export function getDateKeyDaysAgo(daysAgo: number, now = new Date()) {
  return toDateKey(shiftDays(now, -daysAgo));
}

export function formatDateLabel(dateKey: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(fromDateKey(dateKey));
}

export function formatShortDate(dateKey: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
  }).format(fromDateKey(dateKey));
}

export function getLastDateKeys(days: number, now = new Date()) {
  return Array.from({ length: days }, (_, index) =>
    toDateKey(shiftDays(now, -(days - index - 1)))
  );
}

export function computeStreak(dateKeys: string[], now = new Date()) {
  const uniqueKeys = new Set(dateKeys);
  let streak = 0;

  for (let offset = 0; offset < 3650; offset += 1) {
    const key = toDateKey(shiftDays(now, -offset));
    if (!uniqueKeys.has(key)) {
      break;
    }
    streak += 1;
  }

  return streak;
}
