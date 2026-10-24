export default function VenueListHeading({
  venueCount,
  selectedDate,
}) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-orange-600">
          Find your perfect space
        </p>

        <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Explore Venues
        </h2>

        <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">
          Browse banquet halls, party halls, wedding lawns,
          and other event spaces.
        </p>
      </div>

      <p className="text-sm font-medium text-slate-600">
        <span className="font-bold text-slate-900">
          {venueCount}
        </span>{" "}
        venues found
        {selectedDate && ` · Requested date: ${selectedDate}`}
      </p>
    </div>
  );
}