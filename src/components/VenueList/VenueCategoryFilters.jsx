import { SlidersHorizontal } from "lucide-react";
import { venueCategories } from "./venueListData";

export default function VenueCategoryFilters({
  category,
  onCategoryChange,
}) {
  return (
    <div className="mt-8 flex items-center gap-2">
      <SlidersHorizontal
        size={18}
        className="shrink-0 text-orange-500"
      />

      <div className="flex gap-2 overflow-x-auto pb-2">
        {venueCategories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onCategoryChange(item)}
            aria-pressed={category === item}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 active:scale-95 ${
              category === item
                ? "border-orange-500 bg-orange-500 text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:bg-amber-50 hover:text-orange-700"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}