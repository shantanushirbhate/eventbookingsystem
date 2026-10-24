export default function CategoryCard({
  category,
  onSelectCategory,
}) {
  const Icon = category.icon;

  return (
    <button
      type="button"
      onClick={() => onSelectCategory(category.search)}
      aria-label={`Explore ${category.title}`}
      className="group relative block h-[330px] w-full overflow-hidden rounded-2xl bg-slate-900 text-left shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-4 active:scale-[0.99]"
    >
      {/* Category image */}
      <img
        src={category.image}
        alt={category.title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
      />

      {/* Image overlay */}
      <span className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/5" />

      {/* Category icon */}
      <span className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-xl border border-white/30 bg-white/15 text-white shadow-lg backdrop-blur-md">
        <Icon size={24} />
      </span>

      {/* Card content */}
      <span className="absolute inset-x-0 bottom-0 p-5 text-white">
        <span className="block text-xl font-extrabold tracking-tight">
          {category.title}
        </span>

        <span className="mt-2 block text-sm font-medium leading-6 text-white/85">
          {category.description}
        </span>

        <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-amber-300 transition-all group-hover:gap-3 group-hover:text-orange-300">
          Explore venues
          <span aria-hidden="true">→</span>
        </span>
      </span>
    </button>
  );
}