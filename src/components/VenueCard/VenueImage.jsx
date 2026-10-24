export default function VenueImage({ venue }) {
  return (
    <div className="relative h-52 overflow-hidden bg-gray-100">
      <img
        src={venue.image}
        alt={venue.name}
        loading="lazy"
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />

      <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 shadow">
        {venue.type}
      </span>
    </div>
  );
}