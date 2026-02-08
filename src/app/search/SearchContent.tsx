"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { ENTRY_TYPES } from "@/lib/utils/constants";
import type { EntryTypeKey } from "@/lib/utils/constants";

interface SearchResult {
  id: string;
  title: string;
  type: string;
  dateConsumed: string;
  influenceRating: number;
  snippet: string;
  rank: number;
  matchSource: string;
}

export default function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const q = searchParams.get("q") || "";
    if (!q) {
      setResults([]);
      setTotal(0);
      return;
    }

    const fetchResults = async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setResults(data.results || []);
        setTotal(data.total || 0);
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    fetchResults();
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-4 py-3 border border-[#e8e0d6] rounded-lg focus:ring-2 focus:ring-[#c47a2b]/30 focus:border-[#c47a2b] outline-none text-lg text-[#1a1714] placeholder-[#c4bbb0]"
            placeholder="Search entries, reflections, and tags..."
            autoFocus
          />
          <button
            type="submit"
            className="px-6 py-3 bg-[#c47a2b] text-white rounded-lg hover:bg-[#9a5f1e] transition-colors font-medium"
          >
            Search
          </button>
        </div>
      </form>

      {isSearching && (
        <p className="text-[#9a9187] text-center py-8">Searching...</p>
      )}

      {!isSearching && searchParams.get("q") && (
        <div>
          <p className="text-sm text-[#9a9187] mb-4">
            {total} result{total !== 1 ? "s" : ""} for &ldquo;{searchParams.get("q")}&rdquo;
          </p>

          {results.length === 0 && (
            <p className="text-[#c4bbb0] text-center py-8">
              No results found. Try different keywords.
            </p>
          )}

          <div className="space-y-3">
            {results.map((result) => {
              const typeInfo = ENTRY_TYPES[result.type as EntryTypeKey];
              return (
                <Link
                  key={result.id}
                  href={`/entries/${result.id}`}
                  className="block bg-white rounded-xl border border-[#e8e0d6] p-4 shadow-sm hover:shadow-md hover:border-[#c47a2b]/30 transition-all"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={result.type.toLowerCase() as "podcast" | "book" | "article" | "personal_writing"}>
                      {typeInfo?.icon} {typeInfo?.label}
                    </Badge>
                    <span className="text-xs text-[#9a9187]">
                      Matched in {result.matchSource}
                    </span>
                  </div>
                  <h3 className="font-semibold text-[#1a1714]">
                    {result.title}
                  </h3>
                  <p className="text-sm text-[#6b6157] mt-1">
                    {result.snippet}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {!searchParams.get("q") && !isSearching && (
        <p className="text-[#c4bbb0] text-center py-12">
          Search across all your entries, reflections, and tags.
        </p>
      )}
    </div>
  );
}
