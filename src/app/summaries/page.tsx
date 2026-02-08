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
      <h1 className="text-2xl font-bold text-slate-900 mb-1">
        Monthly Summaries
      </h1>
      <p className="text-slate-500 text-sm mb-6">
        Auto-generated overviews of your intellectual activity each month.
      </p>

      {/* Months with entries that can be summarized */}
      {availableMonths.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-medium text-slate-500 mb-3">
            Generate Summaries
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

      {/* Existing summaries */}
      {summaries.length === 0 ? (
        <p className="text-slate-400 text-center py-12">
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
                <Card className="hover:shadow-md hover:border-indigo-200 transition-all mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {MONTH_NAMES[summary.month]} {summary.year}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        {data.entryCount} entries &middot;{" "}
                        {data.topRatedEntries?.[0]
                          ? `Top: "${data.topRatedEntries[0].title}"`
                          : "No entries rated"}
                      </p>
                    </div>
                    <span className="text-indigo-600 text-sm">View &rarr;</span>
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
