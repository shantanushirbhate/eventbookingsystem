
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  Search,
  MapPin,
  Star,
  Users,
  IndianRupee,
  CalendarDays,
  ArrowLeft,
  Building2,
  SlidersHorizontal,
} from "lucide-react";

import { venues } from "../data/data";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import BookingForm from "../components/BookingForm/BookingForm";

const venueCategories = [
  "All Venues",
  "Banquet Hall",
  "Wedding Lawn",
  "Party Hall",
  "Event Space",
];

export default function AllVenues() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Venues");
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [sortBy, setSortBy] = useState("recommended");

  const filteredVenues = useMemo(() => {
    let result = venues.filter((venue) => {
      const search = searchTerm.trim().toLowerCase();

      const matchesSearch =
        !search ||
        venue.name?.toLowerCase().includes(search) ||
        venue.location?.toLowerCase().includes(search) ||
        venue.type?.toLowerCase().includes(search) ||
        venue.amenities?.some((amenity) =>
          String(amenity).toLowerCase().includes(search)
        );

      const matchesCategory =
        selectedCategory === "All Venues" ||
        venue.type?.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });

    if (sortBy === "price-low") {
      result = [...result].sort(
        (a, b) => Number(a.price || 0) - Number(b.price || 0)
      );
    } else if (sortBy === "price-high") {
      result = [...result].sort(
        (a, b) => Number(b.price || 0) - Number(a.price || 0)
      );
    } else if (sortBy === "rating") {
      result = [...result].sort(
        (a, b) => Number(b.rating || 0) - Number(a.rating || 0)
      );
    }

    return result;
  }, [searchTerm, selectedCategory, sortBy]);

  const formatPrice = (price) =>
    Number(price || 0).toLocaleString("en-IN");

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50">
        {/* Page heading */}
        <section className="bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-700 px-4 py-14 text-white sm:py-20">
          <div className="mx-auto max-w-7xl">
            <Link
              to="/"
              className="mb-6 inline-flex items-center gap-2 text-sm text-white/80 transition hover:text-white"
            >
              <ArrowLeft size={18} />
              Back to Home
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-purple-200">
                <Building2 size={18} />
                Explore Venues
              </div>

              <h1 className="text-3xl font-extrabold sm:text-5xl">
                Find the Perfect Venue
              </h1>

              <p className="mt-4 max-w-2xl text-base text-white/80 sm:text-lg">
                Discover banquet halls, wedding lawns, party halls, and
                event spaces for your special occasions in Amravati.
              </p>

              <div className="mt-7 flex flex-wrap gap-5 text-sm text-white/90">
                <span className="flex items-center gap-2">
                  <MapPin size={17} />
                  Amravati, Maharashtra
                </span>
                <span className="flex items-center gap-2">
                  <Building2 size={17} />
                  {venues.length} venues to explore
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Search and filters */}
        <section className="mx-auto max-w-7xl px-4 py-10">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="relative flex-1">
                <Search
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by venue name, location, type, or amenities..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <div className="flex items-center gap-3">
                <SlidersHorizontal
                  size={19}
                  className="shrink-0 text-slate-500"
                />
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none focus:border-violet-500 sm:w-52"
                  aria-label="Sort venues"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {venueCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    selectedCategory === category
                      ? "border-violet-600 bg-violet-600 text-white shadow-md shadow-violet-200"
                      : "border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:text-violet-700"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Results heading */}
          <div className="mb-6 mt-10 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Explore Venues
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {filteredVenues.length}{" "}
                {filteredVenues.length === 1 ? "venue" : "venues"} found
              </p>
            </div>
          </div>

          {/* Venue cards */}
          {filteredVenues.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredVenues.map((venue, index) => (
                <motion.article
                  key={venue.id ?? venue.name ?? index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-56 overflow-hidden bg-slate-200">
                    <img
                      src={venue.image}
                      alt={venue.name || "Event venue"}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-violet-700 shadow-sm">
                      {venue.type || "Event Venue"}
                    </span>

                    {venue.rating != null && (
                      <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-sm font-bold text-slate-800 shadow-sm">
                        <Star
                          size={15}
                          className="fill-amber-400 text-amber-400"
                        />
                        {venue.rating}
                      </span>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="line-clamp-1 text-xl font-bold text-slate-900">
                      {venue.name}
                    </h3>

                    <p className="mt-2 flex items-start gap-2 text-sm text-slate-500">
                      <MapPin
                        size={17}
                        className="mt-0.5 shrink-0 text-violet-600"
                      />
                      <span>{venue.location || "Amravati, Maharashtra"}</span>
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
                      {venue.capacity != null && (
                        <span className="flex items-center gap-1.5">
                          <Users size={16} className="text-violet-600" />
                          {venue.capacity} guests
                        </span>
                      )}

                      {venue.amenities?.length > 0 && (
                        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs">
                          {venue.amenities.slice(0, 2).join(" · ")}
                        </span>
                      )}
                    </div>

                    <div className="my-5 border-t border-slate-100" />

                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs text-slate-500">
                          Starting from
                        </p>
                        <p className="mt-1 flex items-center text-xl font-extrabold text-violet-700">
                          <IndianRupee size={19} />
                          {formatPrice(venue.price)}
                          <span className="ml-1 text-xs font-medium text-slate-500">
                            / event
                          </span>
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedVenue(venue)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-200"
                      >
                        <CalendarDays size={17} />
                        Book Venue
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <Building2
                size={44}
                className="mx-auto text-slate-300"
              />
              <h3 className="mt-4 text-xl font-bold text-slate-800">
                No venues found
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Try another search term or choose a different category.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All Venues");
                  setSortBy("recommended");
                }}
                className="mt-5 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />

      {/* Booking modal */}
      {selectedVenue && (
        <BookingForm
          venue={selectedVenue}
          selectedDate={selectedDate}
          onClose={() => setSelectedVenue(null)}
          onSuccess={() => setSelectedVenue(null)}
        />
      )}
    </>
  );
}
