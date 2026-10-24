export default function VenueAmenities({ amenities = [] }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {amenities.map((amenity) => (
        <span
          key={amenity}
          className="rounded-md bg-gray-100 px-2.5 py-1.5 text-xs text-gray-600"
        >
          {amenity}
        </span>
      ))}
    </div>
  );
}