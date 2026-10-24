import { useMemo } from "react";

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
  const filteredEvents = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return events.filter((event) => {
      const matchesSearch =
        !query ||
        [
          event.title,
          event.category,
          event.location,
          event.venue,
        ].some((value) =>
          String(value ?? "").toLowerCase().includes(query)
        );

      const matchesCategory =
        selectedCategory === "All" ||
        event.category === selectedCategory;

      const matchesDate =
        !selectedDate || event.date === selectedDate;

      return matchesSearch && matchesCategory && matchesDate;
    });
  }, [searchTerm, selectedDate, selectedCategory]);

  return (
    <section
      id="events"
      className="eventnest-section outfit-font px-5 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <EventListHeading count={filteredEvents.length} />

        {/* Category Filters */}
        <EventCategoryFilters
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
        />

        {/* Events Carousel or Empty State */}
        {filteredEvents.length > 0 ? (
          <EventsCarousel
            events={filteredEvents}
            onViewDetails={onViewDetails}
          />
        ) : (
          <EventsEmptyState
            onCategoryChange={onCategoryChange}
          />
        )}
      </div>
    </section>
  );
}