import { formatRelativeTime } from "@/lib/utils/dates";
import type { Reflection } from "@/generated/prisma";

export default function ReflectionList({
  reflections,
}: {
  reflections: Reflection[];
}) {
  if (reflections.length === 0) {
    return (
      <p className="text-[#c4bbb0] text-sm italic">
        No reflections yet. Add one below!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {reflections.map((reflection) => (
        <div
          key={reflection.id}
          className="border-l-2 border-[#c47a2b]/30 pl-4 py-1"
        >
          <p className="text-[#2d2822] text-sm whitespace-pre-wrap">
            {reflection.content}
          </p>
          <p className="text-xs text-[#9a9187] mt-1">
            {formatRelativeTime(reflection.createdAt)}
          </p>
        </div>
      ))}
    </div>
  );
}
