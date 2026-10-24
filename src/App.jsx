
import { useState } from "react";
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

export default function App() {
  const [filters, setFilters] = useState({
    search: "",
    date: "",
  });

  const [eventCategory, setEventCategory] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedVenue, setSelectedVenue] = useState(null);

  // Handle search from the Hero section
  const handleSearch = ({ search, date }) => {
    setFilters({ search, date });

    document.getElementById("events")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // Handle event category selection
  const handleSelectCategory = (category) => {
    setEventCategory(category);

    document.getElementById("events")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <>
      <Navbar />

      <main>
        {/* Hero section with search */}
        <Hero onSearch={handleSearch} />

        {/* Event categories */}
        <EventCategories onSelectCategory={handleSelectCategory} />

        {/* Events carousel */}
        <EventList
          searchTerm={filters.search}
          selectedDate={filters.date}
          selectedCategory={eventCategory}
          onCategoryChange={setEventCategory}
          onViewDetails={setSelectedEvent}
        />

        {/* Venue discovery call to action */}
      
      {/* Venue discovery CTA with animation */}
<motion.section
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
  className="bg-amber-50 px-5 py-14 text-center"
>
  <div className="mx-auto max-w-3xl">
    <motion.p
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mb-3 text-sm font-semibold uppercase tracking-wider text-orange-600"
    >
      Find your perfect space
    </motion.p>

    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.35 }}
      className="text-3xl font-bold text-slate-900 sm:text-4xl"
    >
      The right venue makes every event special
    </motion.h2>

    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="mx-auto mt-4 max-w-2xl text-slate-600"
    >
      Explore banquet halls, wedding lawns, party halls, and
      other event spaces for your next celebration.
    </motion.p>

    <motion.a
      href="#venues"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.65 }}
      whileHover={{ y: -3, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="mt-7 inline-flex items-center justify-center rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
    >
      Explore Venues
    </motion.a>
  </div>
</motion.section>

        {/* Venues carousel */}
   <VenueList
  searchTerm={filters.search}
  selectedDate={filters.date}
  onBook={setSelectedVenue}
  onClearSearch={() =>
    setFilters((prev) => ({
      ...prev,
      search: "",
    }))
  }
/>

        {/* Extracted image gallery */}
        <ImageGallery />

        {/* How it works */}
        <section
          id="how-it-works"
          className="bg-white px-5 py-16"
        >
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-orange-600">
                Simple and convenient
              </p>

              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                How EventNest Works
              </h2>

              <p className="mt-4 text-slate-600">
                Discover events or find a venue in three simple steps.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {/* Step 1 */}
              <div className="rounded-2xl border border-slate-200 p-7 text-center transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-xl font-bold text-orange-600">
                  1
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  Search and Explore
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  Browse events and venues based on your interests,
                  location, and preferred date.
                </p>
              </div>

              {/* Step 2 */}
              <div className="rounded-2xl border border-slate-200 p-7 text-center transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-xl font-bold text-orange-600">
                  2
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  Check the Details
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  Review event information or explore venue capacity,
                  amenities, and sample pricing.
                </p>
              </div>

              {/* Step 3 */}
              <div className="rounded-2xl border border-slate-200 p-7 text-center transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-xl font-bold text-orange-600">
                  3
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  Make an Enquiry
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  Open the venue enquiry form and enter your details
                  to try the demo booking flow.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Customer reviews */}
      <CustomerReviews />

      {/* Extracted footer */}
      <Footer />

      {/* Event details modal */}
      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {/* Venue enquiry / demo booking form */}
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
