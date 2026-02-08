import { prisma } from "@/lib/prisma";
import { TemplateSummaryService } from "@/services/summary/TemplateSummaryService";
import type { MonthlySummaryData } from "@/types/summary";

function getSummaryService() {
  // Future: check process.env.ENABLE_AI_SUMMARIES === "true" for AI service
  return new TemplateSummaryService();
}

export async function generateMonthlySummary(year: number, month: number) {
  const service = getSummaryService();
  const summaryData = await service.generate(year, month);

  // Upsert: create or update the summary for this month
  return prisma.monthlySummary.upsert({
    where: { year_month: { year, month } },
    update: {
      summary: JSON.parse(JSON.stringify(summaryData)),
      generatedAt: new Date(),
    },
    create: {
      year,
      month,
      summary: JSON.parse(JSON.stringify(summaryData)),
    },
  });
}

export async function getMonthlySummary(year: number, month: number) {
  return prisma.monthlySummary.findUnique({
    where: { year_month: { year, month } },
  });
}

export async function getAllSummaries() {
  return prisma.monthlySummary.findMany({
    orderBy: [{ year: "desc" }, { month: "desc" }],
  });
}

export async function getAvailableMonths(): Promise<
  Array<{ year: number; month: number; count: number }>
> {
  const result = await prisma.$queryRaw<
    Array<{ year: number; month: number; count: bigint }>
  >`
    SELECT
      EXTRACT(YEAR FROM "dateConsumed")::int AS year,
      EXTRACT(MONTH FROM "dateConsumed")::int AS month,
      COUNT(*)::bigint AS count
    FROM "Entry"
    GROUP BY year, month
    ORDER BY year DESC, month DESC
  `;

  return result.map((r) => ({
    year: r.year,
    month: r.month,
    count: Number(r.count),
  }));
}
