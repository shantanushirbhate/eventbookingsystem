
export default function HeroCategories({ categories }) {
  return (
    <div className="mt-6 flex flex-wrap gap-3 text-sm font-medium text-white">
      {categories.map((item) => (
        <span
          key={item}
          className="cursor-default rounded-full border border-white/45 bg-white/15 px-4 py-2 backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:border-amber-300 hover:bg-orange-500/50"
        >
          {item}
        </span>
      ))}
    </div>
  );
}
