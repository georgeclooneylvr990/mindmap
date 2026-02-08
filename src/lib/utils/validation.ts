import { z } from "zod";

export const entrySchema = z.object({
  title: z.string().min(1, "Title is required").max(500),
  type: z.enum(["PODCAST", "BOOK", "PERSONAL_WRITING", "ARTICLE"]),
  dateConsumed: z.coerce.date().optional().nullable(),
  source: z.string().max(500).optional().or(z.literal("")),
  author: z.string().max(500).optional().or(z.literal("")),
  content: z.string().optional().or(z.literal("")),
  influenceRating: z.coerce.number().int().min(1).max(5),
  tags: z.array(z.string().min(1).max(100)).max(20).default([]),
});

export const reflectionSchema = z.object({
  entryId: z.string().min(1),
  content: z.string().min(1, "Reflection cannot be empty"),
});

export type EntryFormData = z.infer<typeof entrySchema>;
export type ReflectionFormData = z.infer<typeof reflectionSchema>;
