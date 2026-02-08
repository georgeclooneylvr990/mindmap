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
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link
            href="/entries"
            className="text-sm text-indigo-600 hover:text-indigo-700 mb-2 inline-block"
          >
            &larr; Back to entries
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">{entry.title}</h1>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <Badge variant={entry.type.toLowerCase() as "podcast" | "book" | "article" | "personal_writing"}>
              {typeInfo.icon} {typeInfo.label}
            </Badge>
            <span className="text-sm text-slate-500">
              {formatDate(entry.dateConsumed)}
            </span>
            {entry.author && (
              <span className="text-sm text-slate-500">
                by {entry.author}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/entries/${id}/edit`}
            className="px-4 py-2 bg-slate-100 text-slate-700 text-sm rounded-lg hover:bg-slate-200 transition-colors"
          >
            Edit
          </Link>
          <DeleteEntryButton entryId={id} />
        </div>
      </div>

      {/* Rating */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-4">
        <h2 className="text-sm font-medium text-slate-500 mb-2">
          Influence on Your Thinking
        </h2>
        <StarRating value={entry.influenceRating} readonly size="lg" />
      </div>

      {/* Source */}
      {entry.source && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-4">
          <h2 className="text-sm font-medium text-slate-500 mb-1">Source</h2>
          <p className="text-slate-700">{entry.source}</p>
        </div>
      )}

      {/* Content / Notes */}
      {entry.content && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-4">
          <h2 className="text-sm font-medium text-slate-500 mb-2">Notes</h2>
          <div className="text-slate-700 whitespace-pre-wrap leading-relaxed">
            {entry.content}
          </div>
        </div>
      )}

      {/* Tags */}
      {entry.tags.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-4">
          <h2 className="text-sm font-medium text-slate-500 mb-2">Tags</h2>
          <div className="flex gap-2 flex-wrap">
            {entry.tags.map((tag) => (
              <Link key={tag.id} href={`/entries?tag=${tag.name}`}>
                <Badge>{tag.name}</Badge>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Reflections */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <h2 className="text-sm font-medium text-slate-500 mb-3">
          Reflections ({entry.reflections.length})
        </h2>
        <ReflectionList reflections={entry.reflections} />
        <ReflectionForm entryId={id} />
      </div>
    </div>
  );
}
