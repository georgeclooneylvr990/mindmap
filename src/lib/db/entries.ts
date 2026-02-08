import { prisma } from "@/lib/prisma";
import type { EntryType } from "@/generated/prisma";

export interface EntryFilters {
  type?: EntryType;
  minRating?: number;
  tag?: string;
  month?: string; // "YYYY-MM" format
  sort?: "date_desc" | "date_asc" | "rating_desc" | "rating_asc";
  page?: number;
  limit?: number;
}

export async function getEntries(filters: EntryFilters = {}) {
  const {
    type,
    minRating,
    tag,
    month,
    sort = "date_desc",
    page = 1,
    limit = 50,
  } = filters;

  const where: Record<string, unknown> = {};

  if (type) {
    where.type = type;
  }

  if (minRating) {
    where.influenceRating = { gte: minRating };
  }

  if (tag) {
    where.tags = { some: { name: tag } };
  }

  if (month) {
    const [year, m] = month.split("-").map(Number);
    const startDate = new Date(year, m - 1, 1);
    const endDate = new Date(year, m, 1);
    where.dateConsumed = { gte: startDate, lt: endDate };
  }

  const orderBy = (() => {
    switch (sort) {
      case "date_asc":
        return { dateConsumed: "asc" as const };
      case "rating_desc":
        return { influenceRating: "desc" as const };
      case "rating_asc":
        return { influenceRating: "asc" as const };
      default:
        return { dateConsumed: "desc" as const };
    }
  })();

  const [entries, total] = await Promise.all([
    prisma.entry.findMany({
      where,
      include: { tags: true, reflections: { orderBy: { createdAt: "desc" } } },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.entry.count({ where }),
  ]);

  return { entries, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getEntryById(id: string) {
  return prisma.entry.findUnique({
    where: { id },
    include: {
      tags: true,
      reflections: { orderBy: { createdAt: "desc" } },
    },
  });
}

export async function createEntry(data: {
  title: string;
  type: EntryType;
  dateConsumed?: Date | null;
  source?: string;
  author?: string;
  content?: string;
  influenceRating: number;
  tags: string[];
}) {
  const { tags: tagNames, source, author, content, ...rest } = data;

  return prisma.entry.create({
    data: {
      ...rest,
      dateConsumed: rest.dateConsumed || null,
      source: source || null,
      author: author || null,
      content: content || null,
      tags: {
        connectOrCreate: tagNames
          .filter((name) => name.trim() !== "")
          .map((name) => ({
            where: { name: name.trim().toLowerCase() },
            create: { name: name.trim().toLowerCase() },
          })),
      },
    },
    include: { tags: true },
  });
}

export async function updateEntry(
  id: string,
  data: {
    title: string;
    type: EntryType;
    dateConsumed?: Date | null;
    source?: string;
    author?: string;
    content?: string;
    influenceRating: number;
    tags: string[];
  }
) {
  const { tags: tagNames, source, author, content, ...rest } = data;

  // Disconnect all existing tags, then connect the new ones
  return prisma.entry.update({
    where: { id },
    data: {
      ...rest,
      dateConsumed: rest.dateConsumed || null,
      source: source || null,
      author: author || null,
      content: content || null,
      tags: {
        set: [], // disconnect all
        connectOrCreate: tagNames
          .filter((name) => name.trim() !== "")
          .map((name) => ({
            where: { name: name.trim().toLowerCase() },
            create: { name: name.trim().toLowerCase() },
          })),
      },
    },
    include: { tags: true },
  });
}

export async function deleteEntry(id: string) {
  return prisma.entry.delete({ where: { id } });
}

export async function getRecentEntries(limit: number = 5) {
  return prisma.entry.findMany({
    include: { tags: true },
    orderBy: { dateConsumed: "desc" },
    take: limit,
  });
}

export async function getEntryStats() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalEntries, monthEntries, avgRating] = await Promise.all([
    prisma.entry.count(),
    prisma.entry.count({
      where: { dateConsumed: { gte: startOfMonth } },
    }),
    prisma.entry.aggregate({ _avg: { influenceRating: true } }),
  ]);

  return {
    totalEntries,
    monthEntries,
    avgRating: avgRating._avg.influenceRating
      ? Math.round(avgRating._avg.influenceRating * 10) / 10
      : 0,
  };
}
