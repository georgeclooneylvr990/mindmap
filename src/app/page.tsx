import Link from "next/link";
import { getRecentEntries, getEntryStats } from "@/lib/db/entries";
import { getAllTags } from "@/lib/db/tags";
import EntryCard from "@/components/entries/EntryCard";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default async function HomePage() {
  const [recentEntries, stats, tags] = await Promise.all([
    getRecentEntries(5),
    getEntryStats(),
    getAllTags(),
  ]);

  const topTags = tags.sort((a, b) => b.count - a.count).slice(0, 10);

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#1a1714] tracking-tight">
          Your mind, mapped
        </h1>
        <p className="text-[#9a9187] mt-2 text-base">
          Track, reflect on, and connect the ideas that shape your thinking.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <Card>
          <p className="text-3xl font-bold text-[#c47a2b]">
            {stats.totalEntries}
          </p>
          <p className="text-sm text-[#9a9187] mt-1">Total entries</p>
        </Card>
        <Card>
          <p className="text-3xl font-bold text-emerald-700">
            {stats.monthEntries}
          </p>
          <p className="text-sm text-[#9a9187] mt-1">This month</p>
        </Card>
        <Card>
          <p className="text-3xl font-bold text-[#6b6157]">
            {stats.avgRating || "\u2014"}
          </p>
          <p className="text-sm text-[#9a9187] mt-1">Avg. influence</p>
        </Card>
      </div>

      <div className="flex gap-3 mb-10">
        <Link
          href="/entries/new"
          className="px-5 py-2.5 bg-[#c47a2b] text-white rounded-lg hover:bg-[#9a5f1e] transition-colors font-medium text-sm"
        >
          + New entry
        </Link>
        <Link
          href="/entries"
          className="px-5 py-2.5 bg-white border border-[#e8e0d6] text-[#6b6157] rounded-lg hover:bg-[#f5efe8] transition-colors text-sm"
        >
          View all entries
        </Link>
      </div>

      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#2d2822]">
            Recent entries
          </h2>
          <Link
            href="/entries"
            className="text-sm text-[#c47a2b] hover:text-[#9a5f1e] transition-colors"
          >
            View all &rarr;
          </Link>
        </div>

        {recentEntries.length === 0 ? (
          <Card>
            <p className="text-[#9a9187] text-center py-4">
              No entries yet. Add your first entry to get started!
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {recentEntries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </div>

      {topTags.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-[#2d2822] mb-4">
            Your top themes
          </h2>
          <Card>
            <div className="flex gap-2 flex-wrap">
              {topTags.map((tag) => (
                <Link key={tag.id} href={`/entries?tag=${tag.name}`}>
                  <Badge>
                    {tag.name} ({tag.count})
                  </Badge>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
