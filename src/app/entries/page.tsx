import { Suspense } from "react";
import Link from "next/link";
import { getEntries } from "@/lib/db/entries";
import EntryList from "@/components/entries/EntryList";
import EntryFilters from "@/components/entries/EntryFilters";
import type { EntryType } from "@/generated/prisma";

interface PageProps {
  searchParams: Promise<{
    type?: string;
    minRating?: string;
    tag?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function EntriesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = {
    type: (params.type as EntryType) || undefined,
    minRating: params.minRating ? parseInt(params.minRating) : undefined,
    tag: params.tag || undefined,
    sort: (params.sort as "date_desc" | "date_asc" | "rating_desc" | "rating_asc") || "date_desc",
    page: params.page ? parseInt(params.page) : 1,
  };

  const { entries, total } = await getEntries(filters);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1714]">All entries</h1>
          <p className="text-sm text-[#9a9187] mt-1">
            {total} {total === 1 ? "entry" : "entries"} total
          </p>
        </div>
        <Link
          href="/entries/new"
          className="px-4 py-2 bg-[#c47a2b] text-white text-sm rounded-lg hover:bg-[#9a5f1e] transition-colors font-medium"
        >
          + New entry
        </Link>
      </div>

      <Suspense fallback={<div className="h-10" />}>
        <EntryFilters />
      </Suspense>
      <EntryList entries={entries} />
    </div>
  );
}
