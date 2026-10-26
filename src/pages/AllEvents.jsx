
import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { events } from "../data/data.js";
import EventCard from "../components/EventCard/EventCard";

export default function AllEvents() {
  const [searchParams] = useSearchParams();

  const selectedCategory = searchParams.get("category") || "";
  const selectedSubcategory = searchParams.get("subcategory") || "";

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const categoryMatches =
        !selectedCategory ||
        event.category?.toLowerCase() === selectedCategory.toLowerCase();

      const subcategoryMatches =
        !selectedSubcategory ||
        event.subcategory?.toLowerCase() === selectedSubcategory.toLowerCase();

      return categoryMatches && subcategoryMatches;
    });
  }, [selectedCategory, selectedSubcategory]);

  const heading = selectedSubcategory || selectedCategory || "All Events";

  return (
    <section className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/events"
          className="mb-5 inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
        >
          <span aria-hidden="true">←</span>
          All Events
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {heading}
          </h1>

          <p className="mt-2 text-gray-600">
            {filteredEvents.length} event
            {filteredEvents.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredEvents.map((event) => (
              <EventCard key={event.id ?? event.title} event={event} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <h2 className="text-xl font-bold text-gray-800">
              No matching events found
            </h2>
            <p className="mt-2 text-gray-500">
              There are no events listed under {heading} yet.
            </p>

            <Link
              to="/events"
              className="mt-5 inline-flex rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              View All Events
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
