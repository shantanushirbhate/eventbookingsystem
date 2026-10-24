import { useMemo, useState } from "react";
import { venues } from "../../data/data";
import VenueListHeading from "./VenueListHeading";
import VenueCategoryFilters from "./VenueCategoryFilters";
import VenueCarousel from "./VenueCarousel";
import VenueEmptyState from "./VenueEmptyState";
import { venueCategories } from "./venueListData";
import "./VenuePaginationStyles";

export default function VenueList({
  searchTerm = "",
  selectedDate = "",
  onBook,
  onClearSearch,
}) {
  const [category, setCategory] = useState("All");

  const filteredVenues = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return venues.filter((venue) => {
      const matchesSearch =
        !query ||
        [venue.name, venue.location, venue.type].some((value) =>
          String(value ?? "").toLowerCase().includes(query)
        );

      const matchesCategory =
        category === "All" || venue.type === category;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, category]);

  const handleReset = () => {
    setCategory("All");
    onClearSearch?.();
  };

  return (
    <section id="venues" className="py-12">
      <div className="mx-auto max-w-7xl px-4">
        <VenueListHeading
          venueCount={filteredVenues.length}
          selectedDate={selectedDate}
        />

        <VenueCategoryFilters
          categories={venueCategories}
          category={category}
          onCategoryChange={setCategory}
        />

        {filteredVenues.length > 0 ? (
          <VenueCarousel
            venues={filteredVenues}
            onBook={onBook}
          />
        ) : (
          <VenueEmptyState onReset={handleReset} />
        )}
      </div>
    </section>
  );
}