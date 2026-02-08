import EntryForm from "@/components/entries/EntryForm";

export default function NewEntryPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Add New Entry</h1>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <EntryForm />
      </div>
    </div>
  );
}
