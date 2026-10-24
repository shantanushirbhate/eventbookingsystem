import { ZoomIn } from "lucide-react";

export default function GalleryCard({ item, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      aria-label={`View ${item.title}`}
      className="group relative block h-72 w-full overflow-hidden rounded-2xl bg-slate-200 text-left shadow-md transition duration-300 hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-500 sm:h-80 lg:h-96"
    >
      <img
        src={item.image}
        alt={item.title}
        loading="lazy"
        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
        <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
          {item.category}
        </span>

        <h3 className="mt-3 text-lg font-bold sm:text-xl">
          {item.title}
        </h3>

        <p className="mt-2 flex items-center gap-2 text-sm text-white/90">
          <ZoomIn size={16} />
          View image
        </p>
      </div>
    </button>
  );
}