import { galleryCategories } from "./galleryData";

export default function GalleryFilters({
  activeCategory,
  onCategoryChange,
}) {
  return (
    <div className="mt-8 flex flex-wrap justify-center gap-2">
      {galleryCategories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onCategoryChange(category)}
          aria-pressed={activeCategory === category}
          className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 ${
            activeCategory === category
              ? "border-orange-500 bg-orange-500 text-white shadow-md"
              : "border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:bg-amber-50 hover:text-orange-700"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}