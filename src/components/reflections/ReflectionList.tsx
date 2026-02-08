import { formatRelativeTime } from "@/lib/utils/dates";
import type { Reflection } from "@/generated/prisma";

export default function ReflectionList({
  reflections,
}: {
  reflections: Reflection[];
}) {
  if (reflections.length === 0) {
    return (
      <p className="text-slate-400 text-sm italic">
        No reflections yet. Add one below!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {reflections.map((reflection) => (
        <div
          key={reflection.id}
          className="border-l-2 border-indigo-200 pl-4 py-1"
        >
          <p className="text-slate-700 text-sm whitespace-pre-wrap">
            {reflection.content}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {formatRelativeTime(reflection.createdAt)}
          </p>
        </div>
      ))}
    </div>
  );
}
