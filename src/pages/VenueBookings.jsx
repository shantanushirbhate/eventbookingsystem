
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Users,
  ClipboardList,
  XCircle,
  CheckCircle2,
  Clock,
  Ban,
} from "lucide-react";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

import {
  getBookings,
  cancelBooking,
} from "../utils/bookingStorage";

export default function VenueBookings() {
  const [bookings, setBookings] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [message, setMessage] = useState("");

  const loadBookings = useCallback(() => {
    setBookings(getBookings());
  }, []);

  useEffect(() => {
    loadBookings();

    const handleBookingsUpdated = () => loadBookings();

    window.addEventListener(
      "eventnest-bookings-updated",
      handleBookingsUpdated
    );

    window.addEventListener("storage", handleBookingsUpdated);

    return () => {
      window.removeEventListener(
        "eventnest-bookings-updated",
        handleBookingsUpdated
      );

      window.removeEventListener("storage", handleBookingsUpdated);
    };
  }, [loadBookings]);

  const handleCancelBooking = (booking) => {
    if (booking.status !== "confirmed") return;

    const confirmed = window.confirm(
      `Are you sure you want to cancel your booking for ${
        booking.venueName || booking.venue?.name || "this venue"
      }?`
    );

    if (!confirmed) return;

    const success = cancelBooking(booking.id);

    if (success) {
      setMessage("Booking cancelled successfully.");
      loadBookings();
    } else {
      setMessage("Unable to cancel this booking. Please try again.");
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (activeFilter === "All") return true;

    return (
      String(booking.status || "").toLowerCase() ===
      activeFilter.toLowerCase()
    );
  });

  const getStatusStyle = (status) => {
    switch (String(status || "").toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      case "pending":
        return "bg-amber-100 text-amber-700";

      case "completed":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const formatDate = (date) => {
    if (!date) return "Date not provided";

    const parsedDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) return date;

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getVenueName = (booking) =>
    booking.venueName || booking.venue?.name || booking.name || "Venue";

  const getVenueLocation = (booking) =>
    booking.location || booking.venue?.location || "Location not provided";

  const getVenueImage = (booking) =>
    booking.venueImage ||
    booking.image ||
    booking.venue?.image ||
    "";

  const getBookingPrice = (booking) =>
    booking.totalPrice ??
    booking.totalAmount ??
    booking.price ??
    booking.venue?.price ??
    null;

  const filters = ["All", "confirmed", "pending", "cancelled", "completed"];

  const counts = {
    All: bookings.length,
    confirmed: bookings.filter(
      (booking) => booking.status === "confirmed"
    ).length,
    pending: bookings.filter(
      (booking) => booking.status === "pending"
    ).length,
    cancelled: bookings.filter(
      (booking) => booking.status === "cancelled"
    ).length,
    completed: bookings.filter(
      (booking) => booking.status === "completed"
    ).length,
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50">
        {/* Page header */}
        <section className="bg-gradient-to-r from-orange-600 to-rose-500 px-4 py-12 text-white sm:py-16">
          <div className="mx-auto max-w-7xl">
            <Link
              to="/"
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-white/90 transition hover:text-white"
            >
              <ArrowLeft size={18} />
              Back to Home
            </Link>

            <p className="text-sm font-semibold uppercase tracking-widest text-orange-100">
              Your EventNest account
            </p>

            <h1 className="mt-3 text-3xl font-bold sm:text-5xl">
              My Venue Bookings
            </h1>

            <p className="mt-4 max-w-2xl text-white/90">
              View your venue reservations, check booking details, and manage
              your upcoming celebrations.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Summary cards */}
          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <ClipboardList size={22} />
              </div>

              <p className="mt-4 text-sm text-slate-500">
                Total bookings
              </p>

              <p className="mt-1 text-3xl font-bold text-slate-900">
                {bookings.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
                <CheckCircle2 size={22} />
              </div>

              <p className="mt-4 text-sm text-slate-500">
                Confirmed
              </p>

              <p className="mt-1 text-3xl font-bold text-slate-900">
                {counts.confirmed}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <Clock size={22} />
              </div>

              <p className="mt-4 text-sm text-slate-500">
                Pending
              </p>

              <p className="mt-1 text-3xl font-bold text-slate-900">
                {counts.pending}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <Ban size={22} />
              </div>

              <p className="mt-4 text-sm text-slate-500">
                Cancelled
              </p>

              <p className="mt-1 text-3xl font-bold text-slate-900">
                {counts.cancelled}
              </p>
            </div>
          </div>

          {/* Feedback message */}
          {message && (
            <div
              role="status"
              className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700"
            >
              <span>{message}</span>

              <button
                type="button"
                onClick={() => setMessage("")}
                aria-label="Dismiss message"
                className="text-slate-400 hover:text-slate-700"
              >
                <XCircle size={18} />
              </button>
            </div>
          )}

          {/* Filters */}
          <div className="mb-6 flex flex-wrap items-center gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold capitalize transition ${
                  activeFilter === filter
                    ? "border-orange-500 bg-orange-500 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:text-orange-600"
                }`}
              >
                {filter === "All" ? "All Bookings" : filter}
                <span className="ml-2 opacity-80">
                  {counts[filter]}
                </span>
              </button>
            ))}
          </div>

          {/* Booking list */}
          {filteredBookings.length > 0 ? (
            <div className="space-y-5">
              {filteredBookings.map((booking) => {
                const venueName = getVenueName(booking);
                const venueLocation = getVenueLocation(booking);
                const venueImage = getVenueImage(booking);
                const price = getBookingPrice(booking);

                return (
                  <article
                    key={booking.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                  >
                    <div className="grid md:grid-cols-[240px_1fr]">
                      {/* Image */}
                      <div className="h-52 bg-slate-100 md:h-full">
                        {venueImage ? (
                          <img
                            src={venueImage}
                            alt={venueName}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full min-h-44 items-center justify-center text-slate-400">
                            <MapPin size={42} />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="p-5 sm:p-6">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h2 className="text-xl font-bold text-slate-900">
                              {venueName}
                            </h2>

                            <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                              <MapPin
                                size={17}
                                className="shrink-0 text-orange-500"
                              />
                              {venueLocation}
                            </p>
                          </div>

                          <span
                            className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${getStatusStyle(
                              booking.status
                            )}`}
                          >
                            {booking.status || "Unknown"}
                          </span>
                        </div>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          <div className="flex items-start gap-3">
                            <CalendarDays
                              size={19}
                              className="mt-0.5 text-orange-500"
                            />

                            <div>
                              <p className="text-xs text-slate-500">
                                Booking date
                              </p>

                              <p className="mt-1 text-sm font-semibold text-slate-800">
                                {formatDate(booking.date)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Users
                              size={19}
                              className="mt-0.5 text-orange-500"
                            />

                            <div>
                              <p className="text-xs text-slate-500">
                                Guests
                              </p>

                              <p className="mt-1 text-sm font-semibold text-slate-800">
                                {booking.guests ??
                                  booking.guestCount ??
                                  "Not specified"}
                              </p>
                            </div>
                          </div>

                          <div>
                            <p className="text-xs text-slate-500">
                              Booking amount
                            </p>

                            <p className="mt-1 text-lg font-bold text-orange-600">
                              {price != null
                                ? `₹${Number(price).toLocaleString("en-IN")}`
                                : "Not specified"}
                            </p>
                          </div>
                        </div>

                        {booking.id && (
                          <p className="mt-4 break-all text-xs text-slate-400">
                            Booking ID: {booking.id}
                          </p>
                        )}

                        <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-100 pt-5">
                          {booking.status === "confirmed" && (
                            <button
                              type="button"
                              onClick={() => handleCancelBooking(booking)}
                              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300"
                            >
                              <XCircle size={17} />
                              Cancel Booking
                            </button>
                          )}

                          <Link
                            to="/venues"
                            className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
                          >
                            Explore Venues
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                <CalendarDays size={30} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-900">
                {activeFilter === "All"
                  ? "No bookings yet"
                  : `No ${activeFilter} bookings`}
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {activeFilter === "All"
                  ? "Your venue reservations will appear here after you book a venue."
                  : "There are no bookings in this category right now."}
              </p>

              <Link
                to="/venues"
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
              >
                Explore Venues
              </Link>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
