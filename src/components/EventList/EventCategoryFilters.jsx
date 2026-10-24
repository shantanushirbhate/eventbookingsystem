import { categories } from "./eventListData";

export default function EventCategoryFilters({
  selectedCategory,
  onCategoryChange,
}) {
  return (
    <div className="mt-8 flex flex-wrap gap-2">
      {categories.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onCategoryChange(item)}
          aria-pressed={selectedCategory === item}
          className={`rounded-full border px-4 py-2 text-sm font-semibold transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 active:scale-95 ${
            selectedCategory === item
              ? "border-orange-500 bg-orange-500 text-white shadow-sm"
              : "border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:bg-amber-50 hover:text-orange-700"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}