export interface MonthlySummaryData {
  entryCount: number;
  countByType: Record<string, number>;
  topRatedEntries: Array<{
    id: string;
    title: string;
    type: string;
    rating: number;
  }>;
  mostUsedTags: Array<{ name: string; count: number }>;
  textSummary: string;
  generatedBy: "template" | "ai";
}
