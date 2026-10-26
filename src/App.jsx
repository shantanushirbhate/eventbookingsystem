
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion } from "motion/react";

import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import EventCategories from "./components/EventCategories/EventCategories";
import EventList from "./components/EventList/EventList";
import EventDetailsModal from "./components/EventDetailsModal/EventDetailsModal";
import VenueList from "./components/VenueList/VenueList";
import ImageGallery from "./components/ImageGallery/ImageGallery";
import CustomerReviews from "./components/CustomerReviews/CustomerReviews";
import BookingForm from "./components/BookingForm/BookingForm";
import Footer from "./components/Footer/Footer";

import AllEvents from "./pages/AllEvents";
import AllVenues from "./pages/AllVenues";
import VenueBookings from "./pages/VenueBookings";

function Home() {
  const [filters, setFilters] = useState({
    search: "",
    date: "",
  });

  const [eventCategory, setEventCategory] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleSearch = ({ search, date }) => {
    setFilters({ search, date });

    document.getElementById("events")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const handleSelectCategory = (category) => {
    setEventCategory(category);

    document.getElementById("events")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const handleClearVenueSearch = () => {
    setFilters((previous) => ({
      ...previous,
      search: "",
    }));
  };

  return (
    <>
      <Navbar />

      <Hero onSearch={handleSearch} />

      <EventCategories onSelectCategory={handleSelectCategory} />

      <EventList
        eventCategory={eventCategory}
        searchTerm={filters.search}
        selectedDate={filters.date}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onViewDetails={setSelectedEvent}
      />

      {/* Explore Venues CTA */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto my-16 max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="rounded-3xl bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-12 text-center text-white shadow-xl sm:px-12">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Find Your Perfect Space
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base text-white/90 sm:text-lg">
            Discover beautiful venues and find the perfect place for your
            next celebration.
          </p>

          <a
            href="#venues"
            className="mt-7 inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 font-semibold text-orange-600 transition hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-500"
          >
            Explore Venues
          </a>
        </div>
      </motion.section>

      {/* Homepage Venue Listing */}
      <VenueList
        searchTerm={filters.search}
        selectedDate={filters.date}
        onBook={setSelectedVenue}
        onClearSearch={handleClearVenueSearch}
      />

      <ImageGallery />

      {/* How It Works */}
      <section
        id="how-it-works"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">
            Simple and Easy
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            How It Works
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Find your perfect event or venue in just a few simple steps.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-xl font-bold text-orange-600">
              1
            </div>

            <h3 className="mt-5 text-xl font-semibold text-slate-900">
              Discover
            </h3>

            <p className="mt-3 text-slate-600">
              Browse events and venues that match your interests and needs.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-xl font-bold text-orange-600">
              2
            </div>

            <h3 className="mt-5 text-xl font-semibold text-slate-900">
              Explore Details
            </h3>

            <p className="mt-3 text-slate-600">
              Check event information, venue features, photos, and pricing.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-xl font-bold text-orange-600">
              3
            </div>

            <h3 className="mt-5 text-xl font-semibold text-slate-900">
              Make an Enquiry
            </h3>

            <p className="mt-3 text-slate-600">
              Contact the event organizer or venue to plan your celebration.
            </p>
          </div>
        </div>
      </section>

      <CustomerReviews />

      <Footer />

      {/* Event Details Modal */}
      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {/* Homepage Venue Booking Modal */}
      {selectedVenue && (
        <BookingForm
          key={selectedVenue.id}
          venue={selectedVenue}
          selectedDate={filters.date}
          onClose={() => setSelectedVenue(null)}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<AllEvents />} />
        <Route path="/venues" element={<AllVenues />} />
        <Route path="/my-bookings" element={<VenueBookings />} />
      </Routes>
    </BrowserRouter>
  );
}
