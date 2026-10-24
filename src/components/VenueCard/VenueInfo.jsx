import { MapPin, Users, Star } from "lucide-react";

export default function VenueInfo({ venue }) {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-bold text-gray-900">
          {venue.name}
        </h3>

        <span className="flex shrink-0 items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-sm font-semibold text-amber-700">
          <Star size={14} fill="currentColor" />
          {venue.rating}
        </span>
      </div>

      <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
        <MapPin size={16} className="shrink-0 text-orange-500" />
        {venue.location}
      </p>

      <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
        <Users size={17} className="text-orange-500" />
        Up to {venue.capacity} guests
      </div>
    </>
  );
}