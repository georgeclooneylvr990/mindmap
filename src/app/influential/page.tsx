import { getEntries } from "@/lib/db/entries";
import EntryList from "@/components/entries/EntryList";

export default async function InfluentialPage() {
  const { entries } = await getEntries({
    minRating: 4,
    sort: "rating_desc",
    limit: 100,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1a1714] mb-1">
        Most influential
      </h1>
      <p className="text-[#9a9187] text-sm mb-6">
        Everything rated 4 or 5 — the ideas that most shaped your thinking.
      </p>
      <EntryList entries={entries} />
    </div>
  );
}
