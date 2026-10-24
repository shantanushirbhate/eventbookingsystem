
import React from "react";
import {
  X,
  MapPin,
  CalendarDays,
  Clock,
  Users,
  IndianRupee,
  Tag,
} from "lucide-react";

export default function EventDetailsModel({ event, onClose }) {
  if (!event) return null;

  const formatPrice = (price) =>
    Number(price || 0).toLocaleString("en-IN");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close event details"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-md transition hover:bg-gray-100"
        >
          <X size={22} />
        </button>

        {/* Event image */}
        <div className="relative h-56 sm:h-80">
          <img
            src={
              event.image ||
              "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=85"
            }
            alt={event.title || event.name || "Event"}
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          <div className="absolute bottom-5 left-5 right-5 text-white sm:left-8 sm:bottom-7">
            {event.category && (
              <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-500 px-3 py-1 text-sm font-medium">
                <Tag size={14} />
                {event.category}
              </span>
            )}

            <h2 className="text-2xl font-bold sm:text-3xl">
              {event.title || event.name || "Event Details"}
            </h2>
          </div>
        </div>

        {/* Event information */}
        <div className="space-y-6 p-5 sm:p-8">
          <p className="leading-7 text-gray-600">
            {event.description ||
              "Discover this event and explore the details before making your booking."}
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DetailItem
              icon={<MapPin size={20} />}
              label="Location"
              value={event.location || event.venue || "Amravati"}
            />

            <DetailItem
              icon={<CalendarDays size={20} />}
              label="Event Date"
              value={event.date || "Date to be announced"}
            />

            <DetailItem
              icon={<Clock size={20} />}
              label="Time"
              value={event.time || "Time to be announced"}
            />

            <DetailItem
              icon={<Users size={20} />}
              label="Capacity"
              value={
                event.capacity
                  ? `${event.capacity} guests`
                  : "Contact for details"
              }
            />
          </div>

          {/* Price and booking */}
          <div className="flex flex-col gap-4 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-500">Starting price</p>

              <p className="mt-1 flex items-center gap-1 text-2xl font-bold text-orange-600">
                <IndianRupee size={23} />
                {formatPrice(event.price)}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose?.();
                document
                  .getElementById("booking")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
            >
              Explore Booking Options
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
      <div className="mt-0.5 text-orange-500">{icon}</div>

      <div className="min-w-0">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="mt-1 break-words font-medium text-gray-800">
          {value}
        </p>
      </div>
    </div>
  );
}
