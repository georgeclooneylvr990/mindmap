"use client";

import { INFLUENCE_LABELS } from "@/lib/utils/constants";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function StarRating({
  value,
  onChange,
  readonly = false,
  size = "md",
}: StarRatingProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onChange?.(star)}
          disabled={readonly}
          className={`${sizeClasses[size]} transition-transform ${
            readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
          } ${star <= value ? "grayscale-0" : "grayscale opacity-30"}`}
          title={INFLUENCE_LABELS[star]}
        >
          ⭐
        </button>
      ))}
      {!readonly && value > 0 && (
        <span className="ml-2 text-sm text-slate-500">
          {INFLUENCE_LABELS[value]}
        </span>
      )}
    </div>
  );
}
