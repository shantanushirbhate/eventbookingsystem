import { CalendarDays } from "lucide-react";

export default function EventListHeading({ count }) {
  return (
    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-orange-600">
          Discover experiences
        </p>

        <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Explore Events
        </h2>

        <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">
          Discover celebrations, professional gatherings,
          concerts, festivals, and more.
        </p>
      </div>

      <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
        <CalendarDays size={18} className="text-orange-500" />
        {count} events found
      </div>
    </div>
  );
}