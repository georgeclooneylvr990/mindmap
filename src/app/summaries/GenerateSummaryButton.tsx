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
          ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
          : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
      }`}
    >
      {isGenerating
        ? "Generating..."
        : `${hasExisting ? "Regenerate" : "Generate"} ${monthName} (${entryCount})`}
    </button>
  );
}
