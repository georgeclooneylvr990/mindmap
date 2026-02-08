export const ENTRY_TYPES = {
  PODCAST: { label: "Podcast", color: "amber", icon: "🎙️" },
  BOOK: { label: "Book", color: "emerald", icon: "📚" },
  PERSONAL_WRITING: { label: "Personal Writing", color: "purple", icon: "✍️" },
  ARTICLE: { label: "Article", color: "blue", icon: "📄" },
} as const;

export const INFLUENCE_LABELS: Record<number, string> = {
  1: "Minor",
  2: "Moderate",
  3: "Significant",
  4: "Major",
  5: "Transformative",
};

export type EntryTypeKey = keyof typeof ENTRY_TYPES;
