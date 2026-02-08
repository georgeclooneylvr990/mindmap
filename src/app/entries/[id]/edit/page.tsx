import { notFound } from "next/navigation";
import Link from "next/link";
import { getEntryById } from "@/lib/db/entries";
import EntryForm from "@/components/entries/EntryForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEntryPage({ params }: PageProps) {
  const { id } = await params;
  const entry = await getEntryById(id);

  if (!entry) {
    notFound();
  }

  return (
    <div>
      <Link
        href={`/entries/${id}`}
        className="text-sm text-[#c47a2b] hover:text-[#9a5f1e] mb-2 inline-block"
      >
        &larr; Back to entry
      </Link>
      <h1 className="text-2xl font-bold text-[#1a1714] mb-6">Edit entry</h1>
      <div className="bg-white rounded-xl border border-[#e8e0d6] shadow-sm p-6">
        <EntryForm initialData={entry} />
      </div>
    </div>
  );
}
