import Link from "next/link";
import { notFound } from "next/navigation";
import { getEntryById } from "@/lib/db/entries";
import Badge from "@/components/ui/Badge";
import StarRating from "@/components/ui/StarRating";
import ReflectionList from "@/components/reflections/ReflectionList";
import ReflectionForm from "@/components/reflections/ReflectionForm";
import DeleteEntryButton from "./DeleteEntryButton";
import { ENTRY_TYPES } from "@/lib/utils/constants";
import { formatDate } from "@/lib/utils/dates";
import type { EntryTypeKey } from "@/lib/utils/constants";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EntryDetailPage({ params }: PageProps) {
  const { id } = await params;
  const entry = await getEntryById(id);

  if (!entry) {
    notFound();
  }

  const typeInfo = ENTRY_TYPES[entry.type as EntryTypeKey];

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link
            href="/entries"
            className="text-sm text-[#c47a2b] hover:text-[#9a5f1e] mb-2 inline-block"
          >
            &larr; Back to entries
          </Link>
          <h1 className="text-2xl font-bold text-[#1a1714]">{entry.title}</h1>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <Badge variant={entry.type.toLowerCase() as "podcast" | "book" | "article" | "personal_writing"}>
              {typeInfo.icon} {typeInfo.label}
            </Badge>
            {entry.dateConsumed ? (
              <span className="text-sm text-[#9a9187]">
                {formatDate(entry.dateConsumed)}
              </span>
            ) : (
              <span className="text-sm text-[#c47a2b] font-medium bg-[#fdf0e0] px-2 py-0.5 rounded-full">
                In progress
              </span>
            )}
            {entry.author && (
              <span className="text-sm text-[#9a9187]">
                by {entry.author}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/entries/${id}/edit`}
            className="px-4 py-2 bg-[#f5efe8] text-[#6b6157] text-sm rounded-lg hover:bg-[#e8e0d6] transition-colors"
          >
            Edit
          </Link>
          <DeleteEntryButton entryId={id} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#e8e0d6] shadow-sm p-5 mb-4">
        <h2 className="text-sm font-medium text-[#9a9187] mb-2">
          Influence on your thinking
        </h2>
        <StarRating value={entry.influenceRating} readonly size="lg" />
      </div>

      {entry.source && (
        <div className="bg-white rounded-xl border border-[#e8e0d6] shadow-sm p-5 mb-4">
          <h2 className="text-sm font-medium text-[#9a9187] mb-1">Source</h2>
          {entry.source.startsWith("http") ? (
            <a
              href={entry.source}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#c47a2b] hover:text-[#9a5f1e] underline underline-offset-2 break-all"
            >
              {entry.source}
            </a>
          ) : (
            <p className="text-[#2d2822]">{entry.source}</p>
          )}
        </div>
      )}

      {entry.content && (
        <div className="bg-white rounded-xl border border-[#e8e0d6] shadow-sm p-5 mb-4">
          <h2 className="text-sm font-medium text-[#9a9187] mb-2">Notes</h2>
          <div className="text-[#2d2822] whitespace-pre-wrap leading-relaxed">
            {entry.content}
          </div>
        </div>
      )}

      {entry.tags.length > 0 && (
        <div className="bg-white rounded-xl border border-[#e8e0d6] shadow-sm p-5 mb-4">
          <h2 className="text-sm font-medium text-[#9a9187] mb-2">Tags</h2>
          <div className="flex gap-2 flex-wrap">
            {entry.tags.map((tag) => (
              <Link key={tag.id} href={`/entries?tag=${tag.name}`}>
                <Badge>{tag.name}</Badge>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-[#e8e0d6] shadow-sm p-5">
        <h2 className="text-sm font-medium text-[#9a9187] mb-3">
          Reflections ({entry.reflections.length})
        </h2>
        <ReflectionList reflections={entry.reflections} />
        <ReflectionForm entryId={id} />
      </div>
    </div>
  );
}
