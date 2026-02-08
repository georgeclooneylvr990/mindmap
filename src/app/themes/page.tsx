"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { ThemeData } from "@/types/theme";

const MONTH_SHORT_NAMES = [
  "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function getMonthLabel(monthStr: string) {
  const [year, month] = monthStr.split("-");
  return `${MONTH_SHORT_NAMES[parseInt(month)]} ${year.slice(2)}`;
}

function getIntensityClass(count: number, maxCount: number): string {
  if (count === 0) return "bg-[#f5efe8]";
  const ratio = count / maxCount;
  if (ratio <= 0.2) return "bg-[#fdf0e0]";
  if (ratio <= 0.4) return "bg-[#fde4c4]";
  if (ratio <= 0.6) return "bg-[#e8a65a]";
  if (ratio <= 0.8) return "bg-[#c47a2b] text-white";
  return "bg-[#9a5f1e] text-white";
}

export default function ThemesPage() {
  const [data, setData] = useState<ThemeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/themes")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-12 text-[#9a9187]">Loading themes...</div>
    );
  }

  if (!data || data.tags.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-[#1a1714] mb-1">Themes</h1>
        <p className="text-[#c4bbb0] text-center py-12">
          No theme data yet. Add entries with tags to see your intellectual themes mapped out!
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1a1714] mb-1">Themes</h1>
      <p className="text-[#9a9187] text-sm mb-6">
        How your intellectual themes evolve over time.
      </p>

      <div className="bg-white rounded-xl border border-[#e8e0d6] shadow-sm p-5 mb-6">
        <h2 className="text-sm font-medium text-[#9a9187] mb-3">
          Tag cloud
        </h2>
        <div className="flex flex-wrap gap-2 justify-center">
          {data.tags.map((tag) => {
            const totalCount = data.matrix
              .filter((m) => m.tagName === tag)
              .reduce((sum, m) => sum + m.count, 0);
            const maxTotal = Math.max(
              ...data.tags.map((t) =>
                data.matrix
                  .filter((m) => m.tagName === t)
                  .reduce((s, m) => s + m.count, 0)
              )
            );
            const ratio = maxTotal > 0 ? totalCount / maxTotal : 0;
            const fontSize = 0.75 + ratio * 1.5;

            return (
              <Link
                key={tag}
                href={`/entries?tag=${tag}`}
                className="text-[#c47a2b] hover:text-[#9a5f1e] transition-colors"
                style={{ fontSize: `${fontSize}rem` }}
              >
                {tag}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#e8e0d6] shadow-sm p-5">
        <h2 className="text-sm font-medium text-[#9a9187] mb-4">
          Theme heatmap
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left text-xs text-[#9a9187] font-medium pb-2 pr-4 sticky left-0 bg-white">
                  Theme
                </th>
                {data.months.map((month) => (
                  <th
                    key={month}
                    className="text-center text-xs text-[#9a9187] font-medium pb-2 px-1 min-w-[48px]"
                  >
                    {getMonthLabel(month)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.tags.map((tag) => (
                <tr key={tag}>
                  <td className="text-sm text-[#2d2822] py-1 pr-4 sticky left-0 bg-white font-medium">
                    <Link
                      href={`/entries?tag=${tag}`}
                      className="hover:text-[#c47a2b] transition-colors"
                    >
                      {tag}
                    </Link>
                  </td>
                  {data.months.map((month) => {
                    const cell = data.matrix.find(
                      (m) => m.tagName === tag && m.month === month
                    );
                    const count = cell?.count || 0;

                    return (
                      <td key={month} className="py-1 px-1">
                        <Link
                          href={`/entries?tag=${tag}&month=${month}`}
                          className={`block w-full h-8 rounded flex items-center justify-center text-xs font-medium transition-opacity hover:opacity-80 ${getIntensityClass(
                            count,
                            data.maxCount
                          )}`}
                          title={`${tag} - ${getMonthLabel(month)}: ${count} entries`}
                        >
                          {count > 0 ? count : ""}
                        </Link>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center gap-2 mt-4 text-xs text-[#9a9187]">
          <span>Less</span>
          <div className="w-4 h-4 rounded bg-[#f5efe8]" />
          <div className="w-4 h-4 rounded bg-[#fdf0e0]" />
          <div className="w-4 h-4 rounded bg-[#fde4c4]" />
          <div className="w-4 h-4 rounded bg-[#c47a2b]" />
          <div className="w-4 h-4 rounded bg-[#9a5f1e]" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
