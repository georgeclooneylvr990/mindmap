"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ENTRY_TYPES } from "@/lib/utils/constants";

const selectClasses =
  "px-3 py-1.5 border border-[#e8e0d6] rounded-lg text-sm bg-white text-[#2d2822] focus:ring-2 focus:ring-[#c47a2b]/30 focus:border-[#c47a2b] outline-none";

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
    params.delete("page");
    router.push(`/entries?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <select
        value={currentType}
        onChange={(e) => updateFilter("type", e.target.value)}
        className={selectClasses}
      >
        <option value="">All types</option>
        {Object.entries(ENTRY_TYPES).map(([key, { label, icon }]) => (
          <option key={key} value={key}>
            {icon} {label}
          </option>
        ))}
      </select>

      <select
        value={currentRating}
        onChange={(e) => updateFilter("minRating", e.target.value)}
        className={selectClasses}
      >
        <option value="">Any rating</option>
        <option value="5">5 only</option>
        <option value="4">4+</option>
        <option value="3">3+</option>
        <option value="2">2+</option>
      </select>

      <select
        value={currentSort}
        onChange={(e) => updateFilter("sort", e.target.value)}
        className={selectClasses}
      >
        <option value="date_desc">Newest first</option>
        <option value="date_asc">Oldest first</option>
        <option value="rating_desc">Highest rated</option>
        <option value="rating_asc">Lowest rated</option>
      </select>
    </div>
  );
}
