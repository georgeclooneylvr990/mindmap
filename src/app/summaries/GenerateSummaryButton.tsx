"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  year: number;
  month: number;
  monthName: string;
  entryCount: number;
  hasExisting: boolean;
}

export default function GenerateSummaryButton({
  year,
  month,
  monthName,
  entryCount,
  hasExisting,
}: Props) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/summaries/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year, month }),
      });

      if (!res.ok) throw new Error("Failed to generate");

      router.refresh();
    } catch {
      alert("Failed to generate summary");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleGenerate}
      disabled={isGenerating}
      className={`px-3 py-1.5 text-sm rounded-lg transition-colors disabled:opacity-50 ${
        hasExisting
          ? "bg-[#f5efe8] text-[#6b6157] hover:bg-[#e8e0d6]"
          : "bg-[#fdf0e0] text-[#9a5f1e] hover:bg-[#fde4c4]"
      }`}
    >
      {isGenerating
        ? "Generating..."
        : `${hasExisting ? "Regenerate" : "Generate"} ${monthName} (${entryCount})`}
    </button>
  );
}
