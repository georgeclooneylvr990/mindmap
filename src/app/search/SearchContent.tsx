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
            className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-lg"
            placeholder="Search entries, reflections, and tags..."
            autoFocus
          />
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Search
          </button>
        </div>
      </form>

      {isSearching && (
        <p className="text-slate-500 text-center py-8">Searching...</p>
      )}

      {!isSearching && searchParams.get("q") && (
        <div>
          <p className="text-sm text-slate-500 mb-4">
            {total} result{total !== 1 ? "s" : ""} for &ldquo;{searchParams.get("q")}&rdquo;
          </p>

          {results.length === 0 && (
            <p className="text-slate-400 text-center py-8">
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
                  className="block bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={result.type.toLowerCase() as "podcast" | "book" | "article" | "personal_writing"}>
                      {typeInfo?.icon} {typeInfo?.label}
                    </Badge>
                    <span className="text-xs text-slate-400">
                      Matched in {result.matchSource}
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-900">
                    {result.title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    {result.snippet}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {!searchParams.get("q") && !isSearching && (
        <p className="text-slate-400 text-center py-12">
          Search across all your entries, reflections, and tags.
        </p>
      )}
    </div>
  );
}
