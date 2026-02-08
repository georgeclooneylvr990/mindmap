import { format, parseISO } from "date-fns";

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "MMMM d, yyyy");
}

export function formatMonthYear(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "MMMM yyyy");
}

export function getMonthKey(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "yyyy-MM");
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  return formatDate(d);
}

export interface GroupedByMonth<T> {
  monthKey: string;
  monthLabel: string;
  items: T[];
}

export function groupByMonth<T extends { dateConsumed: Date | string | null }>(
  items: T[]
): GroupedByMonth<T>[] {
  const groups = new Map<string, T[]>();
  const inProgress: T[] = [];

  for (const item of items) {
    if (!item.dateConsumed) {
      inProgress.push(item);
      continue;
    }
    const key = getMonthKey(item.dateConsumed);
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(item);
  }

  const result: GroupedByMonth<T>[] = [];

  if (inProgress.length > 0) {
    result.push({
      monthKey: "in-progress",
      monthLabel: "In progress",
      items: inProgress,
    });
  }

  result.push(
    ...Array.from(groups.entries())
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([key, items]) => ({
        monthKey: key,
        monthLabel: formatMonthYear(items[0].dateConsumed!),
        items,
      }))
  );

  return result;
}
