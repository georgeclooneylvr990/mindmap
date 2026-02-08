"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ReflectionForm({ entryId }: { entryId: string }) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reflections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entryId, content }),
      });

      if (!res.ok) throw new Error("Failed to add reflection");

      setContent("");
      router.refresh();
    } catch {
      alert("Failed to add reflection. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        className="w-full px-3 py-2 border border-[#e8e0d6] rounded-lg focus:ring-2 focus:ring-[#c47a2b]/30 focus:border-[#c47a2b] outline-none resize-y text-sm text-[#1a1714] placeholder-[#c4bbb0]"
        placeholder="Add a reflection... What are you thinking about now?"
      />
      <button
        type="submit"
        disabled={isSubmitting || !content.trim()}
        className="mt-2 px-4 py-2 bg-[#c47a2b] text-white text-sm rounded-lg hover:bg-[#9a5f1e] transition-colors disabled:opacity-50"
      >
        {isSubmitting ? "Adding..." : "Add reflection"}
      </button>
    </form>
  );
}
