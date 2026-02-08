import EntryCard from "./EntryCard";
import { groupByMonth } from "@/lib/utils/dates";
import type { EntryWithTags } from "@/types/entry";

export default function EntryList({ entries }: { entries: EntryWithTags[] }) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-[#9a9187]">
        <p className="text-lg">No entries yet</p>
        <p className="text-sm mt-1">Start by adding your first entry!</p>
      </div>
    );
  }

  const grouped = groupByMonth(entries);

  return (
    <div className="space-y-8">
      {grouped.map((group) => (
        <div key={group.monthKey}>
          <h2 className="text-lg font-semibold text-[#2d2822] mb-3 sticky top-0 bg-[#faf8f5]/90 backdrop-blur-sm py-2 z-10">
            {group.monthLabel}
          </h2>
          <div className="space-y-3">
            {group.items.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
