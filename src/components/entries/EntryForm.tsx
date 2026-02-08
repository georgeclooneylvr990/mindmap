"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StarRating from "@/components/ui/StarRating";
import { ENTRY_TYPES } from "@/lib/utils/constants";
import type { EntryWithTags } from "@/types/entry";

interface EntryFormProps {
  initialData?: EntryWithTags;
}

const inputClasses =
  "w-full px-3 py-2 border border-[#e8e0d6] rounded-lg focus:ring-2 focus:ring-[#c47a2b]/30 focus:border-[#c47a2b] outline-none bg-white text-[#1a1714] placeholder-[#c4bbb0]";

export default function EntryForm({ initialData }: EntryFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState(initialData?.title || "");
  const [type, setType] = useState<string>(initialData?.type || "BOOK");
  const [inProgress, setInProgress] = useState(
    initialData ? !initialData.dateConsumed : false
  );
  const [dateConsumed, setDateConsumed] = useState(
    initialData?.dateConsumed
      ? new Date(initialData.dateConsumed).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  );
  const [source, setSource] = useState(initialData?.source || "");
  const [author, setAuthor] = useState(initialData?.author || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [influenceRating, setInfluenceRating] = useState(
    initialData?.influenceRating || 3
  );
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(
    initialData?.tags.map((t) => t.name) || []
  );

  const addTag = () => {
    const newTag = tagInput.trim().toLowerCase();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const body = {
        title,
        type,
        dateConsumed: inProgress ? null : dateConsumed,
        source,
        author,
        content,
        influenceRating,
        tags,
      };

      const url = initialData
        ? `/api/entries/${initialData.id}`
        : "/api/entries";
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save entry");
      }

      const entry = await res.json();
      router.push(`/entries/${entry.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm border border-red-200">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-[#2d2822] mb-1">
          Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClasses}
          placeholder="What did you consume?"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#2d2822] mb-1">
            Type *
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={inputClasses}
          >
            {Object.entries(ENTRY_TYPES).map(([key, { label, icon }]) => (
              <option key={key} value={key}>
                {icon} {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-[#2d2822]">
              {inProgress ? "Status" : "Date consumed"}
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={inProgress}
                onChange={(e) => setInProgress(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-[#e8e0d6] text-[#c47a2b] focus:ring-[#c47a2b]/30"
              />
              <span className="text-xs text-[#9a9187]">In progress</span>
            </label>
          </div>
          {inProgress ? (
            <div className="flex items-center gap-2 px-3 py-2 bg-[#fdf0e0] border border-[#c47a2b]/20 rounded-lg">
              <span className="text-sm text-[#9a5f1e]">Currently consuming</span>
            </div>
          ) : (
            <input
              type="date"
              value={dateConsumed}
              onChange={(e) => setDateConsumed(e.target.value)}
              className={inputClasses}
              required
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#2d2822] mb-1">
            Author
          </label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className={inputClasses}
            placeholder="Who made this?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#2d2822] mb-1">
            Source
          </label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className={inputClasses}
            placeholder="Where did you find it?"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#2d2822] mb-1">
          Notes
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className={`${inputClasses} resize-y`}
          placeholder="Your thoughts, key ideas, quotes..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#2d2822] mb-2">
          How much did this influence your thinking?
        </label>
        <StarRating value={influenceRating} onChange={setInfluenceRating} />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#2d2822] mb-1">
          Tags
        </label>
        <div className="flex gap-2 mb-2 flex-wrap">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 bg-[#fdf0e0] text-[#9a5f1e] px-2.5 py-1 rounded-full text-sm border border-[#c47a2b]/20"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-[#c47a2b] hover:text-[#9a5f1e] font-bold"
              >
                x
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`flex-1 ${inputClasses}`}
            placeholder="Add a tag and press Enter"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2 bg-[#f5efe8] text-[#6b6157] rounded-lg hover:bg-[#e8e0d6] transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-[#e8e0d6]">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-[#c47a2b] text-white rounded-lg hover:bg-[#9a5f1e] transition-colors disabled:opacity-50 font-medium"
        >
          {isSubmitting
            ? "Saving..."
            : initialData
            ? "Update entry"
            : "Save entry"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 bg-[#f5efe8] text-[#6b6157] rounded-lg hover:bg-[#e8e0d6] transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
