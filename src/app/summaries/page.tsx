import Link from "next/link";
import { getAllSummaries, getAvailableMonths } from "@/lib/db/summaries";
import Card from "@/components/ui/Card";
import GenerateSummaryButton from "./GenerateSummaryButton";
import type { MonthlySummaryData } from "@/types/summary";

const MONTH_NAMES = [
  "", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default async function SummariesPage() {
  const [summaries, availableMonths] = await Promise.all([
    getAllSummaries(),
    getAvailableMonths(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1a1714] mb-1">
        Monthly summaries
      </h1>
      <p className="text-[#9a9187] text-sm mb-6">
        Auto-generated overviews of your intellectual activity each month.
      </p>

      {availableMonths.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-medium text-[#9a9187] mb-3">
            Generate summaries
          </h2>
          <div className="flex gap-2 flex-wrap">
            {availableMonths.map(({ year, month, count }) => {
              const existing = summaries.find(
                (s) => s.year === year && s.month === month
              );
              return (
                <GenerateSummaryButton
                  key={`${year}-${month}`}
                  year={year}
                  month={month}
                  monthName={`${MONTH_NAMES[month]} ${year}`}
                  entryCount={count}
                  hasExisting={!!existing}
                />
              );
            })}
          </div>
        </div>
      )}

      {summaries.length === 0 ? (
        <p className="text-[#c4bbb0] text-center py-12">
          No summaries generated yet. Add some entries, then generate your first summary!
        </p>
      ) : (
        <div className="space-y-4">
          {summaries.map((summary) => {
            const data = summary.summary as unknown as MonthlySummaryData;
            return (
              <Link
                key={summary.id}
                href={`/summaries/${summary.year}/${summary.month}`}
              >
                <Card className="hover:shadow-md hover:border-[#c47a2b]/30 transition-all mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-[#1a1714]">
                        {MONTH_NAMES[summary.month]} {summary.year}
                      </h3>
                      <p className="text-sm text-[#9a9187] mt-1">
                        {data.entryCount} entries &middot;{" "}
                        {data.topRatedEntries?.[0]
                          ? `Top: "${data.topRatedEntries[0].title}"`
                          : "No entries rated"}
                      </p>
                    </div>
                    <span className="text-[#c47a2b] text-sm">View &rarr;</span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
