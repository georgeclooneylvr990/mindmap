import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import type { SummaryService } from "./SummaryService";
import type { MonthlySummaryData } from "@/types/summary";

export class TemplateSummaryService implements SummaryService {
  async generate(year: number, month: number): Promise<MonthlySummaryData> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const entries = await prisma.entry.findMany({
      where: {
        dateConsumed: { gte: startDate, lt: endDate },
      },
      include: { tags: true },
      orderBy: { influenceRating: "desc" },
    });

    // Count by type
    const countByType: Record<string, number> = {};
    for (const entry of entries) {
      countByType[entry.type] = (countByType[entry.type] || 0) + 1;
    }

    // Top-rated entries (up to 5)
    const topRatedEntries = entries.slice(0, 5).map((e) => ({
      id: e.id,
      title: e.title,
      type: e.type,
      rating: e.influenceRating,
    }));

    // Tag frequency
    const tagCounts = new Map<string, number>();
    for (const entry of entries) {
      for (const tag of entry.tags) {
        tagCounts.set(tag.name, (tagCounts.get(tag.name) || 0) + 1);
      }
    }
    const mostUsedTags = Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    // Generate text summary
    const monthName = format(startDate, "MMMM yyyy");
    const topEntry = topRatedEntries[0];
    const topTagNames = mostUsedTags.slice(0, 3).map((t) => t.name);

    let textSummary = `In ${monthName}, you consumed ${entries.length} piece${entries.length !== 1 ? "s" : ""} of content.`;

    if (Object.keys(countByType).length > 0) {
      const typeLabels: Record<string, string> = {
        PODCAST: "podcast",
        BOOK: "book",
        ARTICLE: "article",
        PERSONAL_WRITING: "personal writing",
      };
      const typeParts = Object.entries(countByType)
        .map(
          ([type, count]) =>
            `${count} ${typeLabels[type] || type.toLowerCase()}${count > 1 ? "s" : ""}`
        )
        .join(", ");
      textSummary += ` This included ${typeParts}.`;
    }

    if (topEntry) {
      textSummary += ` Your most influential piece was "${topEntry.title}" (rated ${topEntry.rating}/5).`;
    }

    if (topTagNames.length > 0) {
      textSummary += ` Key themes: ${topTagNames.join(", ")}.`;
    }

    return {
      entryCount: entries.length,
      countByType,
      topRatedEntries,
      mostUsedTags,
      textSummary,
      generatedBy: "template",
    };
  }
}
