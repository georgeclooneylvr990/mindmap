import { Suspense } from "react";
import SearchContent from "./SearchContent";

export default function SearchPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1a1714] mb-6">Search</h1>
      <Suspense fallback={<p className="text-[#9a9187] text-center py-8">Loading...</p>}>
        <SearchContent />
      </Suspense>
    </div>
  );
}
