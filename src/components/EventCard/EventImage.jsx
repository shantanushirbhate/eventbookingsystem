export default function EventImage({ event }) {
  return (
    <div className="relative h-52 overflow-hidden">
      <img
        src={event.image}
        alt={event.title}
        loading="lazy"
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />

      <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-orange-600 shadow-sm">
        {event.category}
      </span>
    </div>
  );
}