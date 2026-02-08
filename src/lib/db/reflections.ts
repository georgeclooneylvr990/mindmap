import { prisma } from "@/lib/prisma";

export async function createReflection(entryId: string, content: string) {
  return prisma.reflection.create({
    data: {
      entryId,
      content,
    },
  });
}

export async function getReflectionsByEntryId(entryId: string) {
  return prisma.reflection.findMany({
    where: { entryId },
    orderBy: { createdAt: "desc" },
  });
}
