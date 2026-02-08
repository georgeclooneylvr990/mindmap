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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome to Your Intellectual Diary
        </h1>
        <p className="text-slate-500 mt-1">
          Track, reflect on, and connect the ideas that shape your thinking.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <p className="text-3xl font-bold text-indigo-600">
            {stats.totalEntries}
          </p>
          <p className="text-sm text-slate-500">Total Entries</p>
        </Card>
        <Card>
          <p className="text-3xl font-bold text-emerald-600">
            {stats.monthEntries}
          </p>
          <p className="text-sm text-slate-500">This Month</p>
        </Card>
        <Card>
          <p className="text-3xl font-bold text-amber-600">
            {stats.avgRating || "\u2014"}
          </p>
          <p className="text-sm text-slate-500">Avg. Influence Rating</p>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 mb-8">
        <Link
          href="/entries/new"
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
        >
          + Add New Entry
        </Link>
        <Link
          href="/entries"
          className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm"
        >
          View All Entries
        </Link>
      </div>

      {/* Recent Entries */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">
            Recent Entries
          </h2>
          <Link
            href="/entries"
            className="text-sm text-indigo-600 hover:text-indigo-700"
          >
            View all &rarr;
          </Link>
        </div>

        {recentEntries.length === 0 ? (
          <Card>
            <p className="text-slate-400 text-center py-4">
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

      {/* Top Tags */}
      {topTags.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Your Top Themes
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
