import Link from "next/link";
import Badge from "@/components/ui/Badge";
import StarRating from "@/components/ui/StarRating";
import { ENTRY_TYPES } from "@/lib/utils/constants";
import { formatDate } from "@/lib/utils/dates";
import type { EntryWithTags } from "@/types/entry";
import type { EntryTypeKey } from "@/lib/utils/constants";

export default function EntryCard({ entry }: { entry: EntryWithTags }) {
  const typeInfo = ENTRY_TYPES[entry.type as EntryTypeKey];

  return (
    <Link href={`/entries/${entry.id}`} className="block group">
      <div className="bg-white rounded-xl border border-[#e8e0d6] p-4 shadow-sm hover:shadow-md hover:border-[#c47a2b]/30 transition-all">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={entry.type.toLowerCase() as "podcast" | "book" | "article" | "personal_writing"}>
                {typeInfo.icon} {typeInfo.label}
              </Badge>
              {entry.dateConsumed ? (
                <span className="text-xs text-[#9a9187]">
                  {formatDate(entry.dateConsumed)}
                </span>
              ) : (
                <span className="text-xs text-[#c47a2b] font-medium">
                  In progress
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-[#1a1714] group-hover:text-[#c47a2b] transition-colors truncate">
                {entry.title}
              </h3>
              {entry.source && entry.source.startsWith("http") && (
                <span
                  className="text-[#9a9187] flex-shrink-0"
                  title="Has source link"
                >
                  <span className="text-xs">↗</span>
                </span>
              )}
            </div>

            {entry.author && (
              <p className="text-sm text-[#9a9187] mt-0.5">by {entry.author}</p>
            )}

            {entry.content && (
              <p className="text-sm text-[#6b6157] mt-2 line-clamp-2">
                {entry.content}
              </p>
            )}

            {entry.tags.length > 0 && (
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {entry.tags.slice(0, 4).map((tag) => (
                  <Badge key={tag.id}>{tag.name}</Badge>
                ))}
                {entry.tags.length > 4 && (
                  <span className="text-xs text-[#9a9187] self-center">
                    +{entry.tags.length - 4} more
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex-shrink-0">
            <StarRating value={entry.influenceRating} readonly size="sm" />
          </div>
        </div>
      </div>
    </Link>
  );
}
