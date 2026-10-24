import { Search } from "lucide-react";

export default function EventsEmptyState({
  onCategoryChange,
}) {
  return (
    <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white/95 px-6 py-14 text-center">
      <Search
        className="mx-auto text-orange-500"
        size={32}
      />

      <h3 className="mt-4 text-xl font-bold text-slate-900">
        No events found
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        Try another search term, category, or date.
      </p>

      <button
        type="button"
        onClick={() => onCategoryChange("All")}
        className="mt-4 font-bold text-orange-600 transition hover:text-orange-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
      >
        Show all categories
      </button>
    </div>
  );
}