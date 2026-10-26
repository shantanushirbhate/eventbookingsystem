
import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";

import { events } from "../../data/data.js";

import EventListHeading from "./EventListHeading";
import EventCategoryFilters from "./EventCategoryFilters";
import EventsCarousel from "./EventsCarousel";
import EventsEmptyState from "./EventsEmptyState";

export default function EventList({
  searchTerm = "",
  selectedDate = "",
  selectedCategory = "All",
  onCategoryChange = () => {},
  onViewDetails,
}) {
  const [eventSearch, setEventSearch] = useState("");

  const filteredEvents = useMemo(() => {
    const query = eventSearch.trim().toLowerCase();

    return events.filter((event) => {
      const matchesName =
        !query ||
        String(event.title ?? "").toLowerCase().includes(query);

      const matchesSearch =
        !searchTerm.trim() ||
        [
          event.title,
          event.category,
          event.location,
          event.venue,
        ].some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(searchTerm.trim().toLowerCase())
        );

      const matchesCategory =
        selectedCategory === "All" ||
        String(event.category ?? "").toLowerCase() ===
          selectedCategory.toLowerCase();

      const matchesDate =
        !selectedDate || event.date === selectedDate;

      return (
        matchesName &&
        matchesSearch &&
        matchesCategory &&
        matchesDate
      );
    });
  }, [
    eventSearch,
    searchTerm,
    selectedDate,
    selectedCategory,
  ]);

  const clearSearch = () => setEventSearch("");

  return (
    <section
      id="events"
      className="eventnest-section outfit-font px-5 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <EventListHeading count={filteredEvents.length} />

        {/* Search box above the event cards */}
        <div className="mt-6 mb-6 max-w-xl">
          <label
            htmlFor="event-name-search"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Search events by name
          </label>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">
            <Search
              size={20}
              className="shrink-0 text-orange-500"
            />

            <input
              id="event-name-search"
              type="search"
              value={eventSearch}
              onChange={(e) => setEventSearch(e.target.value)}
              placeholder="Search wedding, birthday, concert..."
              className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />

            {eventSearch && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear event search"
                className="shrink-0 rounded-full p-1 text-slate-500 transition hover:bg-orange-50 hover:text-orange-600"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Category filters */}
        <EventCategoryFilters
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
        />

        {/* Event cards or empty state */}
        {filteredEvents.length > 0 ? (
          <EventsCarousel
            events={filteredEvents}
            onViewDetails={onViewDetails}
          />
        ) : (
          <div className="py-12 text-center">
            <EventsEmptyState
              onCategoryChange={onCategoryChange}
            />

            {eventSearch && (
              <button
                type="button"
                onClick={clearSearch}
                className="mt-4 rounded-lg bg-orange-500 px-5 py-2.5 font-semibold text-white transition hover:bg-orange-600"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
