"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ENTRY_TYPES } from "@/lib/utils/constants";

export default function EntryFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentType = searchParams.get("type") || "";
  const currentRating = searchParams.get("minRating") || "";
  const currentSort = searchParams.get("sort") || "date_desc";

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // Reset pagination on filter change
    router.push(`/entries?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <select
        value={currentType}
        onChange={(e) => updateFilter("type", e.target.value)}
        className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
      >
        <option value="">All Types</option>
        {Object.entries(ENTRY_TYPES).map(([key, { label, icon }]) => (
          <option key={key} value={key}>
            {icon} {label}
          </option>
        ))}
      </select>

      <select
        value={currentRating}
        onChange={(e) => updateFilter("minRating", e.target.value)}
        className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
      >
        <option value="">Any Rating</option>
        <option value="5">5 Stars Only</option>
        <option value="4">4+ Stars</option>
        <option value="3">3+ Stars</option>
        <option value="2">2+ Stars</option>
      </select>

      <select
        value={currentSort}
        onChange={(e) => updateFilter("sort", e.target.value)}
        className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
      >
        <option value="date_desc">Newest First</option>
        <option value="date_asc">Oldest First</option>
        <option value="rating_desc">Highest Rated</option>
        <option value="rating_asc">Lowest Rated</option>
      </select>
    </div>
  );
}
