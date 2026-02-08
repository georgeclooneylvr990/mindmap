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
        className="text-sm text-indigo-600 hover:text-indigo-700 mb-2 inline-block"
      >
        &larr; Back to entry
      </Link>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Edit Entry</h1>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <EntryForm initialData={entry} />
      </div>
    </div>
  );
}
