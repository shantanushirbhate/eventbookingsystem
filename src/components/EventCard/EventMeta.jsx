import {
  CalendarDays,
  MapPin,
  Clock,
} from "lucide-react";

export default function EventMeta({ event }) {
  const formattedDate = new Date(
    `${event.date}T12:00:00`
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="mt-4 space-y-3 text-sm text-slate-500">
      <p className="flex items-center gap-2">
        <CalendarDays
          size={17}
          className="text-orange-500"
        />
        {formattedDate}
      </p>

      <p className="flex items-center gap-2">
        <Clock size={17} className="text-orange-500" />
        {event.time}
      </p>

      <p className="flex items-center gap-2">
        <MapPin size={17} className="text-orange-500" />
        {event.location}
      </p>
    </div>
  );
}