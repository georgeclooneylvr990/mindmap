import type { Entry, Reflection, Tag, EntryType } from "@/generated/prisma";

export type EntryWithRelations = Entry & {
  tags: Tag[];
  reflections: Reflection[];
};

export type EntryWithTags = Entry & {
  tags: Tag[];
};

export type { Entry, Reflection, Tag, EntryType };
