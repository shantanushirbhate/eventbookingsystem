
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function EventListHeading() {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <div>
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-orange-600">
          Discover What's Happening
        </p>

        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Explore Events
        </h2>

        <p className="mt-2 text-slate-600">
          Find exciting events and celebrations around you.
        </p>
      </div>

      <Link
        to="/events"
        className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-orange-500 px-4 py-2.5 font-semibold text-orange-600 transition hover:bg-orange-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
      >
        View All
        <ArrowRight size={18} />
      </Link>
    </div>
  );
}
