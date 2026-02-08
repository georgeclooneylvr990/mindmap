import EntryForm from "@/components/entries/EntryForm";

export default function NewEntryPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1a1714] mb-6">New entry</h1>
      <div className="bg-white rounded-xl border border-[#e8e0d6] shadow-sm p-6">
        <EntryForm />
      </div>
    </div>
  );
}
