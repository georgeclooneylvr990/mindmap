import { prisma } from "@/lib/prisma";

export async function getAllTags() {
  const tags = await prisma.tag.findMany({
    include: { _count: { select: { entries: true } } },
    orderBy: { name: "asc" },
  });

  return tags.map((tag) => ({
    id: tag.id,
    name: tag.name,
    count: tag._count.entries,
  }));
}

export async function searchTags(query: string) {
  const tags = await prisma.tag.findMany({
    where: { name: { contains: query.toLowerCase(), mode: "insensitive" as const } },
    include: { _count: { select: { entries: true } } },
    orderBy: { name: "asc" },
    take: 20,
  });

  return tags.map((tag) => ({
    id: tag.id,
    name: tag.name,
    count: tag._count.entries,
  }));
}
