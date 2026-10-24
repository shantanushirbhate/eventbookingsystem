
import { X, MapPin } from "lucide-react";

export default function BookingHeader({ venue, onClose }) {
  return (
    <div className="flex items-start justify-between bg-orange-500 p-6 text-white">
      <div>
        <p className="text-sm text-orange-100">
          Your event starts here
        </p>

        <h2
          id="booking-title"
          className="mt-1 text-2xl font-bold"
        >
          Book your venue
        </h2>

        <p className="mt-2 flex items-center gap-1.5 text-sm text-white/90">
          <MapPin size={15} />
          {venue.location}
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close booking form"
        className="rounded-lg p-2 transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/70"
      >
        <X size={22} />
      </button>
    </div>
  );
}
