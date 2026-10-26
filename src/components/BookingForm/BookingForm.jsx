
import { useEffect, useMemo, useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";

import {
  getBookings,
  saveBookings,
  isDateBooked,
} from "../../utils/bookingStorage";

const today = () => {
  const date = new Date();

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

const formatDate = (value) =>
  new Date(`${value}T12:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const makeId = () =>
  `EN${Date.now().toString().slice(-8)}${Math.floor(
    Math.random() * 90 + 10
  )}`;

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export default function BookingForm({ venue, onClose }) {
  const [step, setStep] = useState(1);
  const [view, setView] = useState("booking");
  const [bookings, setBookings] = useState(() => getBookings());
  const [selectedDate, setSelectedDate] = useState("");

  const [month, setMonth] = useState(() => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });

  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [error, setError] = useState("");
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelMessage, setCancelMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    eventType: "Wedding",
    guests: "100",
    notes: "",
    acceptedPolicy: false,
  });

  useEffect(() => {
    const refreshBookings = () => setBookings(getBookings());

    window.addEventListener(
      "eventnest-bookings-updated",
      refreshBookings
    );
    window.addEventListener("storage", refreshBookings);

    return () => {
      window.removeEventListener(
        "eventnest-bookings-updated",
        refreshBookings
      );
      window.removeEventListener("storage", refreshBookings);
    };
  }, []);

  const year = month.getFullYear();
  const monthIndex = month.getMonth();

  const firstWeekday = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const calendarDays = useMemo(
    () => [
      ...Array(firstWeekday).fill(null),
      ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ],
    [firstWeekday, daysInMonth]
  );

  // Only show bookings belonging to the selected venue.
  const venueBookings = useMemo(
    () =>
      bookings.filter(
        (booking) =>
          String(booking.venueId) === String(venue.id)
      ),
    [bookings, venue.id]
  );

  const updateForm = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const chooseDate = (day) => {
    const date = `${year}-${String(monthIndex + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;

    if (date < today() || isDateBooked(venue.id, date, getBookings())) {
      return;
    }

    setSelectedDate(date);
    setError("");
  };

  const confirmBooking = () => {
    setError("");

    if (!selectedDate) {
      setError("Please select an available date.");
      setStep(1);
      return;
    }

    if (!form.name.trim() || !/^[0-9]{10}$/.test(form.phone)) {
      setError("Enter your name and a valid 10-digit phone number.");
      setStep(2);
      return;
    }

    const guestCount = Number(form.guests);
    const capacity = Number(venue.capacity) || 10000;

    if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > capacity) {
      setError("Enter a guest count within the venue capacity.");
      setStep(2);
      return;
    }

    if (!form.acceptedPolicy) {
      setError("Please accept the cancellation policy before confirming.");
      setStep(3);
      return;
    }

    // Recheck availability immediately before saving.
    const latestBookings = getBookings();

    if (isDateBooked(venue.id, selectedDate, latestBookings)) {
      setBookings(latestBookings);
      setError(
        "This date is no longer available. Please choose another date."
      );
      setStep(1);
      return;
    }

    const booking = {
      id: makeId(),
      venueId: venue.id,
      venueName: venue.name,
      location: venue.location || "",
      venueImage: venue.image || "",
      date: selectedDate,
      price: venue.price,
      customerName: form.name.trim(),
      phone: form.phone,
      eventType: form.eventType,
      guests: guestCount,
      notes: form.notes.trim(),
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    saveBookings([...latestBookings, booking]);

    setBookings(getBookings());
    setConfirmedBooking(booking);
    setError("");
  };

  const cancelBooking = () => {
    if (!cancelTarget) return;

    const latestBookings = getBookings();

    const target = latestBookings.find(
      (booking) => booking.id === cancelTarget.id
    );

    if (!target || target.status !== "confirmed") {
      setCancelMessage("This booking has already been cancelled.");
      setBookings(latestBookings);
      setCancelTarget(null);
      return;
    }

    const daysUntilEvent = Math.ceil(
      (new Date(`${target.date}T00:00:00`).getTime() -
        new Date(`${today()}T00:00:00`).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (daysUntilEvent < 3) {
      setCancelMessage(
        "Cancellation is unavailable within 72 hours of the event under this demo policy."
      );
      setCancelTarget(null);
      return;
    }

    const updatedBookings = latestBookings.map((booking) =>
      booking.id === target.id
        ? {
            ...booking,
            status: "cancelled",
            cancelledAt: new Date().toISOString(),
            refundPercent: daysUntilEvent >= 7 ? 100 : 50,
          }
        : booking
    );

    saveBookings(updatedBookings);
    setBookings(getBookings());
    setCancelTarget(null);
    setCancelMessage("Booking cancelled. The date is available again.");
  };

  const resetBooking = () => {
    setStep(1);
    setSelectedDate("");
    setConfirmedBooking(null);
    setError("");

    setForm({
      name: "",
      phone: "",
      eventType: "Wedding",
      guests: "100",
      notes: "",
      acceptedPolicy: false,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-6">
      <div className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between border-b bg-white p-5 sm:p-6">
          <div>
            <p className="text-sm font-semibold text-orange-600">
              EventNest booking
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
              {venue.name}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {venue.location} · {money(venue.price)} per event (demo price)
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close booking"
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={22} />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          {/* Tabs */}
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setView("booking");
                setCancelMessage("");
              }}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                view === "booking"
                  ? "bg-orange-500 text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              Book this venue
            </button>

            <button
              type="button"
              onClick={() => {
                setView("history");
                setCancelMessage("");
                setBookings(getBookings());
              }}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                view === "history"
                  ? "bg-orange-500 text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              My Bookings ({venueBookings.length})
            </button>
          </div>

          {cancelMessage && (
            <div className="mb-4 rounded-xl bg-orange-50 p-3 text-sm text-orange-800">
              {cancelMessage}
            </div>
          )}

          {/* Booking history */}
          {view === "history" ? (
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900">
                Booking history
              </h3>

              {venueBookings.length === 0 ? (
                <p className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
                  No bookings for this venue yet.
                </p>
              ) : (
                venueBookings
                  .slice()
                  .reverse()
                  .map((booking) => (
                    <div
                      key={booking.id}
                      className="rounded-2xl border border-slate-200 p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h4 className="font-bold text-slate-900">
                            {booking.venueName || venue.name}
                          </h4>

                          <p className="mt-1 text-sm text-slate-600">
                            {formatDate(booking.date)}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Reference: {booking.id}
                          </p>

                          <p className="mt-1 text-sm text-slate-600">
                            Event: {booking.eventType || "Not specified"} ·
                            Guests: {booking.guests || "Not specified"}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            booking.status === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {booking.status === "confirmed"
                            ? "Confirmed"
                            : booking.status === "cancelled"
                            ? "Cancelled"
                            : booking.status}
                        </span>
                      </div>

                      {booking.status === "confirmed" && (
                        <button
                          type="button"
                          onClick={() => setCancelTarget(booking)}
                          className="mt-3 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                        >
                          Cancel booking
                        </button>
                      )}
                    </div>
                  ))
              )}
            </div>
          ) : confirmedBooking ? (
            /* Booking confirmation */
            <div className="py-8 text-center">
              <CheckCircle2
                className="mx-auto text-green-500"
                size={56}
              />

              <h3 className="mt-4 text-2xl font-bold text-slate-900">
                Booking confirmed!
              </h3>

              <p className="mt-2 text-slate-600">
                Your selected date is now marked unavailable for this venue.
              </p>

              <div className="mx-auto mt-6 max-w-md rounded-2xl bg-slate-50 p-5 text-left">
                <p className="text-sm text-slate-500">Booking reference</p>

                <p className="text-lg font-bold text-orange-600">
                  {confirmedBooking.id}
                </p>

                <div className="mt-4 space-y-2 text-sm text-slate-700">
                  <p>
                    <strong>Venue:</strong> {confirmedBooking.venueName}
                  </p>
                  <p>
                    <strong>Date:</strong> {formatDate(confirmedBooking.date)}
                  </p>
                  <p>
                    <strong>Event:</strong> {confirmedBooking.eventType}
                  </p>
                  <p>
                    <strong>Guests:</strong> {confirmedBooking.guests}
                  </p>
                  <p>
                    <strong>Demo price:</strong> {money(confirmedBooking.price)}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setView("history");
                    setBookings(getBookings());
                  }}
                  className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  View bookings
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
                >
                  Done
                </button>

                <button
                  type="button"
                  onClick={resetBooking}
                  className="rounded-xl border border-orange-200 px-5 py-3 font-semibold text-orange-600 hover:bg-orange-50"
                >
                  Book another date
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Steps */}
              <div className="mb-6 grid grid-cols-4 gap-2">
                {["Date", "Details", "Policy", "Confirm"].map(
                  (label, index) => {
                    const number = index + 1;

                    return (
                      <button
                        type="button"
                        key={label}
                        onClick={() => {
                          if (number < step) {
                            setStep(number);
                            setError("");
                          }
                        }}
                        className={`rounded-xl px-2 py-3 text-center text-xs font-bold sm:text-sm ${
                          step === number
                            ? "bg-orange-500 text-white"
                            : step > number
                            ? "bg-orange-100 text-orange-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <span className="mr-1">{number}.</span>
                        {label}
                      </button>
                    );
                  }
                )}
              </div>

              {/* Step 1: Date */}
              {step === 1 && (
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        Choose your event date
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Red dates are already booked.
                      </p>
                    </div>

                    <CalendarDays className="text-orange-500" size={24} />
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-3 sm:p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() =>
                          setMonth(new Date(year, monthIndex - 1, 1))
                        }
                        disabled={
                          year === new Date().getFullYear() &&
                          monthIndex <= new Date().getMonth()
                        }
                        className="rounded-lg p-2 hover:bg-slate-100 disabled:opacity-30"
                        aria-label="Previous month"
                      >
                        <ChevronLeft />
                      </button>

                      <h4 className="font-bold text-slate-900">
                        {month.toLocaleDateString("en-IN", {
                          month: "long",
                          year: "numeric",
                        })}
                      </h4>

                      <button
                        type="button"
                        onClick={() =>
                          setMonth(new Date(year, monthIndex + 1, 1))
                        }
                        className="rounded-lg p-2 hover:bg-slate-100"
                        aria-label="Next month"
                      >
                        <ChevronRight />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                        (day) => (
                          <div
                            key={day}
                            className="py-2 text-xs font-semibold text-slate-400"
                          >
                            {day}
                          </div>
                        )
                      )}

                      {calendarDays.map((day, index) => {
                        if (!day) {
                          return <div key={`blank-${index}`} />;
                        }

                        const date = `${year}-${String(
                          monthIndex + 1
                        ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

                        const past = date < today();
                        const booked = isDateBooked(
                          venue.id,
                          date,
                          bookings
                        );
                        const selected = selectedDate === date;
                        const disabled = past || booked;

                        return (
                          <button
                            type="button"
                            key={date}
                            disabled={disabled}
                            onClick={() => chooseDate(day)}
                            title={
                              booked
                                ? "Already booked"
                                : past
                                ? "Past date"
                                : "Available"
                            }
                            className={`relative flex aspect-square items-center justify-center rounded-xl text-sm font-semibold transition ${
                              booked
                                ? "cursor-not-allowed bg-red-100 text-red-600 line-through"
                                : past
                                ? "cursor-not-allowed text-slate-300"
                                : selected
                                ? "bg-orange-500 text-white ring-2 ring-orange-200"
                                : "text-slate-700 hover:bg-orange-50 hover:text-orange-600"
                            }`}
                          >
                            {day}

                            {booked && (
                              <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-red-600" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
                      <span>
                        <span className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-red-500" />
                        Booked
                      </span>
                      <span>
                        <span className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-orange-500" />
                        Selected
                      </span>
                      <span>Plain date = available</span>
                    </div>
                  </div>

                  {selectedDate && (
                    <p className="mt-4 rounded-xl bg-orange-50 p-3 text-sm font-semibold text-orange-800">
                      Selected date: {formatDate(selectedDate)}
                    </p>
                  )}
                </div>
              )}

              {/* Step 2: Details */}
              {step === 2 && (
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Tell us about your event
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Date:{" "}
                    {selectedDate
                      ? formatDate(selectedDate)
                      : "Not selected"}
                  </p>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Full name *
                      <input
                        name="name"
                        value={form.name}
                        onChange={updateForm}
                        className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 font-normal outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                        placeholder="Enter your name"
                      />
                    </label>

                    <label className="text-sm font-semibold text-slate-700">
                      Phone number *
                      <input
                        name="phone"
                        inputMode="numeric"
                        maxLength={10}
                        value={form.phone}
                        onChange={updateForm}
                        className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 font-normal outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                        placeholder="10-digit mobile number"
                      />
                    </label>

                    <label className="text-sm font-semibold text-slate-700">
                      Event type
                      <select
                        name="eventType"
                        value={form.eventType}
                        onChange={updateForm}
                        className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 font-normal outline-none focus:border-orange-500"
                      >
                        {[
                          "Wedding",
                          "Birthday",
                          "Engagement",
                          "Corporate",
                          "Anniversary",
                          "Other",
                        ].map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="text-sm font-semibold text-slate-700">
                      Number of guests
                      <input
                        name="guests"
                        type="number"
                        min="1"
                        max={venue.capacity || 10000}
                        value={form.guests}
                        onChange={updateForm}
                        className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 font-normal outline-none focus:border-orange-500"
                      />
                      <span className="mt-1 block text-xs font-normal text-slate-500">
                        Venue capacity:{" "}
                        {venue.capacity || "Please confirm with venue"}
                      </span>
                    </label>

                    <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
                      Additional requirements
                      <textarea
                        name="notes"
                        value={form.notes}
                        onChange={updateForm}
                        rows={3}
                        className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 font-normal outline-none focus:border-orange-500"
                        placeholder="Decoration, catering, timing, or other requests"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Step 3: Cancellation policy */}
              {step === 3 && (
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Cancellation policy
                  </h3>

                  <p className="mt-2 text-sm text-slate-600">
                    Please review these demo cancellation rules before
                    confirming.
                  </p>

                  <div className="mt-4 space-y-3">
                    <div className="rounded-xl border border-slate-200 p-4">
                      <p className="font-semibold text-slate-800">
                        7 or more days before the event
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        Eligible for a 100% demo refund.
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-4">
                      <p className="font-semibold text-slate-800">
                        3–6 days before the event
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        Eligible for a 50% demo refund.
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-4">
                      <p className="font-semibold text-slate-800">
                        Less than 72 hours before the event
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        Cancellation is not allowed in this demo policy.
                      </p>
                    </div>
                  </div>

                  <label className="mt-5 flex items-start gap-3 rounded-xl bg-orange-50 p-4 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      name="acceptedPolicy"
                      checked={form.acceptedPolicy}
                      onChange={updateForm}
                      className="mt-1 accent-orange-500"
                    />
                    <span>
                      I have read and agree to the cancellation policy. I
                      understand that this is a demo booking and no real
                      payment is taken.
                    </span>
                  </label>
                </div>
              )}

              {/* Step 4: Review */}
              {step === 4 && (
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Review your booking
                  </h3>

                  <div className="mt-4 rounded-2xl border border-slate-200 p-5">
                    <div className="space-y-3 text-sm text-slate-700">
                      <p>
                        <strong>Venue:</strong> {venue.name}
                      </p>
                      <p>
                        <strong>Location:</strong> {venue.location}
                      </p>
                      <p>
                        <strong>Date:</strong>{" "}
                        {selectedDate ? formatDate(selectedDate) : "Not selected"}
                      </p>
                      <p>
                        <strong>Customer:</strong> {form.name}
                      </p>
                      <p>
                        <strong>Phone:</strong> {form.phone}
                      </p>
                      <p>
                        <strong>Event:</strong> {form.eventType}
                      </p>
                      <p>
                        <strong>Guests:</strong> {form.guests}
                      </p>
                      <p>
                        <strong>Price estimate:</strong> {money(venue.price)}
                      </p>
                    </div>

                    <p className="mt-4 border-t pt-4 text-xs text-slate-500">
                      Demo only: this does not collect payment or contact the
                      venue owner.
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <p
                  role="alert"
                  className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700"
                >
                  {error}
                </p>
              )}

              {/* Navigation */}
              <div className="mt-6 flex items-center justify-between gap-3 border-t pt-5">
                <button
                  type="button"
                  onClick={() => {
                    setError("");

                    if (step === 1) {
                      onClose();
                    } else {
                      setStep((current) => current - 1);
                    }
                  }}
                  className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {step === 1 ? "Close" : "Back"}
                </button>

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setError("");

                      if (step === 1) {
                        if (!selectedDate) {
                          setError("Please select an available date.");
                          return;
                        }

                        if (
                          isDateBooked(venue.id, selectedDate, getBookings())
                        ) {
                          setBookings(getBookings());
                          setError(
                            "This date is no longer available. Please choose another date."
                          );
                          return;
                        }
                      }

                      if (step === 2) {
                        if (
                          !form.name.trim() ||
                          !/^[0-9]{10}$/.test(form.phone)
                        ) {
                          setError(
                            "Enter your name and a valid 10-digit phone number."
                          );
                          return;
                        }

                        const guestCount = Number(form.guests);
                        const capacity = Number(venue.capacity) || 10000;

                        if (
                          !Number.isInteger(guestCount) ||
                          guestCount < 1 ||
                          guestCount > capacity
                        ) {
                          setError(
                            "Enter a guest count within the venue capacity."
                          );
                          return;
                        }
                      }

                      if (step === 3 && !form.acceptedPolicy) {
                        setError(
                          "Please accept the cancellation policy to continue."
                        );
                        return;
                      }

                      setStep((current) => current + 1);
                    }}
                    className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={confirmBooking}
                    className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
                  >
                    Confirm booking
                  </button>
                )}
              </div>
            </>
          )}

          {/* Cancellation confirmation */}
          {cancelTarget && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4">
              <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                <h3 className="text-lg font-bold text-slate-900">
                  Cancel this booking?
                </h3>

                <p className="mt-2 text-sm text-slate-600">
                  {cancelTarget.venueName || venue.name} on{" "}
                  {formatDate(cancelTarget.date)}. The date will become
                  available again if cancellation is permitted.
                </p>

                <div className="mt-5 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setCancelTarget(null)}
                    className="rounded-xl border px-4 py-2 font-semibold text-slate-700"
                  >
                    Keep booking
                  </button>

                  <button
                    type="button"
                    onClick={cancelBooking}
                    className="rounded-xl bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
                  >
                    Confirm cancellation
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
