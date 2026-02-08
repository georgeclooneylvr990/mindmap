"use client";

import { INFLUENCE_LABELS } from "@/lib/utils/constants";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { dot: "w-2.5 h-2.5", gap: "gap-1" },
  md: { dot: "w-3.5 h-3.5", gap: "gap-1.5" },
  lg: { dot: "w-4.5 h-4.5", gap: "gap-2" },
};

export default function StarRating({
  value,
  onChange,
  readonly = false,
  size = "md",
}: StarRatingProps) {
  const s = sizeMap[size];

  return (
    <div className={`flex items-center ${s.gap}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onChange?.(star)}
          disabled={readonly}
          className={`rounded-full transition-all ${s.dot} ${
            readonly ? "cursor-default" : "cursor-pointer hover:scale-125"
          } ${
            star <= value
              ? "bg-[#c47a2b] shadow-sm shadow-[#c47a2b]/30"
              : "bg-[#e8e0d6]"
          }`}
          title={INFLUENCE_LABELS[star]}
          aria-label={`${star} of 5 - ${INFLUENCE_LABELS[star]}`}
        />
      ))}
      {!readonly && value > 0 && (
        <span className="ml-2 text-sm text-[#9a9187]">
          {INFLUENCE_LABELS[value]}
        </span>
      )}
    </div>
  );
}
