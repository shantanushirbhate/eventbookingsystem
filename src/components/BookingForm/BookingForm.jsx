import { useEffect, useMemo, useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  CheckCircle2,
  Check,
  MapPin,
  Users,
  Minus,
  Plus,
  ShieldCheck,
  Pencil,
  Ticket,
  User,
  Phone,
  AlertCircle,
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

const formatShort = (value) =>
  new Date(`${value}T12:00:00`).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
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

const eventTypes = [
  { name: "Wedding", emoji: "💍" },
  { name: "Birthday", emoji: "🎂" },
  { name: "Engagement", emoji: "💫" },
  { name: "Corporate", emoji: "💼" },
  { name: "Anniversary", emoji: "❤️" },
  { name: "Other", emoji: "✨" },
];

const stepLabels = ["Date", "Details", "Policy", "Confirm"];

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100";

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

  // Escape closes the form, page scroll is locked while open
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

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
        (booking) => String(booking.venueId) === String(venue.id)
      ),
    [bookings, venue.id]
  );

  const capacity = Number(venue.capacity) || 10000;

  const updateForm = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const changeGuests = (amount) => {
    setForm((previous) => {
      const next = Math.min(
        capacity,
        Math.max(1, (Number(previous.guests) || 0) + amount)
      );
      return { ...previous, guests: String(next) };
    });
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

    if (
      !Number.isInteger(guestCount) ||
      guestCount < 1 ||
      guestCount > capacity
    ) {
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

  const goNext = () => {
    setError("");

    if (step === 1) {
      if (!selectedDate) {
        setError("Please select an available date.");
        return;
      }

      if (isDateBooked(venue.id, selectedDate, getBookings())) {
        setBookings(getBookings());
        setError(
          "This date is no longer available. Please choose another date."
        );
        return;
      }
    }

    if (step === 2) {
      if (!form.name.trim() || !/^[0-9]{10}$/.test(form.phone)) {
        setError("Enter your name and a valid 10-digit phone number.");
        return;
      }

      const guestCount = Number(form.guests);

      if (
        !Number.isInteger(guestCount) ||
        guestCount < 1 ||
        guestCount > capacity
      ) {
        setError("Enter a guest count within the venue capacity.");
        return;
      }
    }

    if (step === 3 && !form.acceptedPolicy) {
      setError("Please accept the cancellation policy to continue.");
      return;
    }

    setStep((current) => current + 1);
  };

  const goBack = () => {
    setError("");

    if (step === 1) {
      onClose();
    } else {
      setStep((current) => current - 1);
    }
  };

  const showFooter = view === "booking" && !confirmedBooking;
  const guestPercent = Math.min(
    100,
    Math.round(((Number(form.guests) || 0) / capacity) * 100)
  );

  const reviewRow = (label, value) => (
    <div className="flex items-start justify-between gap-4 py-2.5 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-semibold text-slate-900">
        {value}
      </span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm sm:items-center sm:p-6">
      <div className="relative flex max-h-[94dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        {/* Header */}
        <div className="relative shrink-0 overflow-hidden bg-gradient-to-br from-orange-500 via-orange-500 to-amber-400 px-5 pb-5 pt-5 text-white sm:px-7">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/15" />
          <div className="pointer-events-none absolute -bottom-12 right-24 h-28 w-28 rounded-full bg-white/10" />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close booking"
            className="absolute right-4 top-4 z-10 rounded-full bg-white/20 p-2 text-white transition hover:bg-white/30"
          >
            <X size={20} />
          </button>

          <div className="relative flex items-center gap-4 pr-10">
            {venue.image ? (
              <img
                src={venue.image}
                alt=""
                className="h-16 w-16 shrink-0 rounded-2xl object-cover ring-2 ring-white/60 sm:h-20 sm:w-20"
              />
            ) : (
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 sm:h-20 sm:w-20">
                <CalendarDays size={30} />
              </span>
            )}

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-orange-100">
                EventNest booking
              </p>

              <h2 className="mt-0.5 truncate text-lg font-bold sm:text-2xl">
                {venue.name}
              </h2>

              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-orange-50 sm:text-sm">
                {venue.location && (
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {venue.location}
                  </span>
                )}
                <span className="font-semibold">
                  {money(venue.price)} per event
                </span>
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="relative mt-5 inline-flex rounded-full bg-white/20 p-1">
            <button
              type="button"
              onClick={() => {
                setView("booking");
                setCancelMessage("");
              }}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                view === "booking"
                  ? "bg-white text-orange-600 shadow"
                  : "text-white hover:bg-white/10"
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
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                view === "history"
                  ? "bg-white text-orange-600 shadow"
                  : "text-white hover:bg-white/10"
              }`}
            >
              My Bookings ({venueBookings.length})
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-7">
          {cancelMessage && (
            <div className="mb-5 flex items-start gap-2 rounded-xl bg-orange-50 p-3 text-sm text-orange-800">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              {cancelMessage}
            </div>
          )}

          {/* Booking history */}
          {view === "history" ? (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900">
                Booking history
              </h3>

              {venueBookings.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                  <Ticket
                    className="mx-auto text-slate-300"
                    size={40}
                  />
                  <p className="mt-3 text-sm text-slate-500">
                    No bookings for this venue yet.
                  </p>
                  <button
                    type="button"
                    onClick={() => setView("booking")}
                    className="mt-4 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
                  >
                    Book a date
                  </button>
                </div>
              ) : (
                venueBookings
                  .slice()
                  .reverse()
                  .map((booking) => {
                    const confirmed = booking.status === "confirmed";

                    return (
                      <div
                        key={booking.id}
                        className={`overflow-hidden rounded-2xl border ${
                          confirmed
                            ? "border-slate-200"
                            : "border-slate-100 bg-slate-50"
                        }`}
                      >
                        <div className="flex gap-4 p-4">
                          <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                            <span className="text-xl font-bold leading-none">
                              {new Date(
                                `${booking.date}T12:00:00`
                              ).getDate()}
                            </span>
                            <span className="mt-1 text-[11px] font-semibold uppercase">
                              {new Date(
                                `${booking.date}T12:00:00`
                              ).toLocaleDateString("en-IN", {
                                month: "short",
                              })}
                            </span>
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="truncate font-bold text-slate-900">
                                {booking.venueName || venue.name}
                              </h4>

                              <span
                                className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                                  confirmed
                                    ? "bg-green-100 text-green-700"
                                    : "bg-slate-200 text-slate-600"
                                }`}
                              >
                                {confirmed
                                  ? "Confirmed"
                                  : booking.status === "cancelled"
                                  ? "Cancelled"
                                  : booking.status}
                              </span>
                            </div>

                            <p className="mt-1 text-sm text-slate-600">
                              {formatDate(booking.date)}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {booking.eventType || "Event"} ·{" "}
                              {booking.guests || "—"} guests · Ref{" "}
                              {booking.id}
                            </p>

                            {!confirmed &&
                              booking.refundPercent !== undefined && (
                                <p className="mt-2 text-xs font-semibold text-slate-600">
                                  Demo refund: {booking.refundPercent}%
                                </p>
                              )}
                          </div>
                        </div>

                        {confirmed && (
                          <div className="border-t border-slate-100 bg-slate-50 px-4 py-3">
                            <button
                              type="button"
                              onClick={() => setCancelTarget(booking)}
                              className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                            >
                              Cancel booking
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
              )}
            </div>
          ) : confirmedBooking ? (
            /* Booking confirmation */
            <div className="py-2 text-center">
              <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 ring-8 ring-green-50">
                <CheckCircle2 className="text-green-500" size={44} />
              </span>

              <h3 className="mt-5 text-2xl font-bold text-slate-900">
                Booking confirmed!
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                Your selected date is now marked unavailable for this
                venue.
              </p>

              {/* Ticket */}
              <div className="mx-auto mt-6 max-w-md overflow-hidden rounded-3xl border border-orange-100 bg-white text-left shadow-lg">
                <div className="bg-gradient-to-r from-orange-500 to-amber-400 px-6 py-4 text-white">
                  <p className="text-xs font-semibold uppercase tracking-widest text-orange-100">
                    Booking reference
                  </p>
                  <p className="mt-1 text-2xl font-bold tracking-wider">
                    {confirmedBooking.id}
                  </p>
                </div>

                <div className="relative px-6 py-5">
                  <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-slate-100" />
                  <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-slate-100" />

                  <div className="divide-y divide-slate-100 text-sm">
                    {reviewRow("Venue", confirmedBooking.venueName)}
                    {reviewRow(
                      "Date",
                      formatDate(confirmedBooking.date)
                    )}
                    {reviewRow("Event", confirmedBooking.eventType)}
                    {reviewRow("Guests", confirmedBooking.guests)}
                    {reviewRow(
                      "Demo price",
                      money(confirmedBooking.price)
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setView("history");
                    setBookings(getBookings());
                  }}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  View bookings
                </button>

                <button
                  type="button"
                  onClick={resetBooking}
                  className="rounded-xl border border-orange-200 px-5 py-3 text-sm font-semibold text-orange-600 hover:bg-orange-50"
                >
                  Book another date
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-200 hover:from-orange-600 hover:to-amber-600"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Stepper: smaller on mobile, original size from sm up */}
              <div className="mb-6 flex items-start sm:mb-7">
                {stepLabels.map((label, index) => {
                  const number = index + 1;
                  const done = step > number;
                  const active = step === number;

                  return (
                    <div
                      key={label}
                      className="flex flex-1 items-start last:flex-none"
                    >
                      <button
                        type="button"
                        disabled={number > step}
                        onClick={() => {
                          if (number < step) {
                            setStep(number);
                            setError("");
                          }
                        }}
                        className="flex flex-col items-center gap-1 disabled:cursor-default sm:gap-1.5"
                      >
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition sm:h-9 sm:w-9 sm:text-sm ${
                            done
                              ? "bg-orange-500 text-white"
                              : active
                              ? "bg-orange-500 text-white ring-4 ring-orange-100"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {done ? (
                            <Check
                              size={14}
                              className="sm:h-[18px] sm:w-[18px]"
                            />
                          ) : (
                            number
                          )}
                        </span>
                        <span
                          className={`text-[9px] font-semibold sm:text-xs ${
                            active || done
                              ? "text-orange-600"
                              : "text-slate-400"
                          }`}
                        >
                          {label}
                        </span>
                      </button>

                      {number < stepLabels.length && (
                        <span
                          className={`mx-1.5 mt-[13px] h-0.5 flex-1 rounded-full transition sm:mx-2 sm:mt-[17px] ${
                            done ? "bg-orange-500" : "bg-slate-200"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Step 1: Date */}
              {step === 1 && (
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Choose your event date
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Pick any available day. Booked dates are shown in
                    red.
                  </p>

                  <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-3 shadow-sm sm:p-5">
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
                        className="rounded-xl p-2 text-slate-600 hover:bg-orange-50 disabled:opacity-30 disabled:hover:bg-transparent"
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
                        className="rounded-xl p-2 text-slate-600 hover:bg-orange-50"
                        aria-label="Next month"
                      >
                        <ChevronRight />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center sm:gap-1.5">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                        (day) => (
                          <div
                            key={day}
                            className="py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400"
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
                        ).padStart(2, "0")}-${String(day).padStart(
                          2,
                          "0"
                        )}`;

                        const past = date < today();
                        const booked = isDateBooked(
                          venue.id,
                          date,
                          bookings
                        );
                        const selected = selectedDate === date;
                        const isToday = date === today();
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
                            className={`relative flex aspect-square items-center justify-center rounded-xl text-sm font-semibold transition active:scale-95 ${
                              booked
                                ? "cursor-not-allowed bg-red-50 text-red-400 line-through"
                                : past
                                ? "cursor-not-allowed text-slate-300"
                                : selected
                                ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-200"
                                : isToday
                                ? "text-orange-600 ring-2 ring-orange-300 hover:bg-orange-50"
                                : "text-slate-700 hover:bg-orange-50 hover:text-orange-600"
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <span className="h-3 w-3 rounded bg-gradient-to-br from-orange-500 to-amber-500" />
                        Selected
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-3 w-3 rounded bg-red-100 ring-1 ring-red-200" />
                        Booked
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-3 w-3 rounded ring-2 ring-orange-300" />
                        Today
                      </span>
                    </div>
                  </div>

                  {selectedDate && (
                    <div className="mt-4 flex items-center gap-3 rounded-2xl bg-orange-50 p-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white">
                        <CalendarDays size={20} />
                      </span>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">
                          Selected date
                        </p>
                        <p className="font-bold text-slate-900">
                          {formatDate(selectedDate)}
                        </p>
                      </div>
                    </div>
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
                    {selectedDate
                      ? formatDate(selectedDate)
                      : "No date selected"}
                  </p>

                  <p className="mt-5 text-sm font-semibold text-slate-700">
                    Event type
                  </p>
                  <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-6">
                    {eventTypes.map((type) => {
                      const active = form.eventType === type.name;

                      return (
                        <button
                          type="button"
                          key={type.name}
                          onClick={() =>
                            setForm((previous) => ({
                              ...previous,
                              eventType: type.name,
                            }))
                          }
                          aria-pressed={active}
                          className={`flex flex-col items-center gap-1 rounded-2xl border-2 px-2 py-3 text-xs font-semibold transition active:scale-95 ${
                            active
                              ? "border-orange-500 bg-orange-50 text-orange-700"
                              : "border-slate-100 bg-slate-50 text-slate-600 hover:border-orange-200"
                          }`}
                        >
                          <span className="text-2xl">{type.emoji}</span>
                          {type.name}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <label className="text-sm font-semibold text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <User size={15} className="text-orange-500" />
                        Full name *
                      </span>
                      <input
                        name="name"
                        value={form.name}
                        onChange={updateForm}
                        className={inputClass}
                        placeholder="Enter your name"
                        autoComplete="name"
                      />
                    </label>

                    <label className="text-sm font-semibold text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <Phone size={15} className="text-orange-500" />
                        Phone number *
                      </span>
                      <input
                        name="phone"
                        inputMode="numeric"
                        maxLength={10}
                        value={form.phone}
                        onChange={updateForm}
                        className={inputClass}
                        placeholder="10-digit mobile number"
                        autoComplete="tel"
                      />
                    </label>

                    {/* Guests stepper */}
                    <div className="sm:col-span-2">
                      <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                        <Users size={15} className="text-orange-500" />
                        Number of guests
                      </span>

                      <div className="mt-2 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => changeGuests(-10)}
                          aria-label="Decrease guests"
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-orange-300 hover:bg-orange-50 active:scale-95"
                        >
                          <Minus size={18} />
                        </button>

                        <input
                          name="guests"
                          type="number"
                          min="1"
                          max={capacity}
                          value={form.guests}
                          onChange={updateForm}
                          className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-center text-lg font-bold text-slate-900 outline-none focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100"
                        />

                        <button
                          type="button"
                          onClick={() => changeGuests(10)}
                          aria-label="Increase guests"
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-orange-300 hover:bg-orange-50 active:scale-95"
                        >
                          <Plus size={18} />
                        </button>
                      </div>

                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full transition-all ${
                            guestPercent >= 100
                              ? "bg-red-500"
                              : "bg-gradient-to-r from-orange-500 to-amber-400"
                          }`}
                          style={{ width: `${guestPercent}%` }}
                        />
                      </div>
                      <p className="mt-1.5 text-xs text-slate-500">
                        Venue capacity:{" "}
                        {venue.capacity || "Please confirm with venue"}
                      </p>
                    </div>

                    <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
                      Additional requirements
                      <textarea
                        name="notes"
                        value={form.notes}
                        onChange={updateForm}
                        rows={3}
                        className={inputClass}
                        placeholder="Decoration, catering, timing, or other requests"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Step 3: Cancellation policy */}
              {step === 3 && (
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                    <ShieldCheck className="text-orange-500" size={22} />
                    Cancellation policy
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Please review these demo cancellation rules before
                    confirming.
                  </p>

                  <div className="mt-5 space-y-3">
                    {[
                      {
                        badge: "100%",
                        title: "7 or more days before the event",
                        text: "Eligible for a 100% demo refund.",
                        tone: "bg-green-100 text-green-700",
                      },
                      {
                        badge: "50%",
                        title: "3–6 days before the event",
                        text: "Eligible for a 50% demo refund.",
                        tone: "bg-amber-100 text-amber-700",
                      },
                      {
                        badge: "None",
                        title: "Less than 72 hours before the event",
                        text: "Cancellation is not allowed in this demo policy.",
                        tone: "bg-red-100 text-red-700",
                      },
                    ].map((tier) => (
                      <div
                        key={tier.title}
                        className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4"
                      >
                        <span
                          className={`flex h-12 w-14 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${tier.tone}`}
                        >
                          {tier.badge}
                        </span>
                        <div>
                          <p className="font-semibold text-slate-800">
                            {tier.title}
                          </p>
                          <p className="mt-0.5 text-sm text-slate-600">
                            {tier.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <label
                    className={`mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 text-sm text-slate-700 transition ${
                      form.acceptedPolicy
                        ? "border-orange-500 bg-orange-50"
                        : "border-slate-100 bg-slate-50 hover:border-orange-200"
                    }`}
                  >
                    <input
                      type="checkbox"
                      name="acceptedPolicy"
                      checked={form.acceptedPolicy}
                      onChange={updateForm}
                      className="mt-0.5 h-5 w-5 shrink-0 accent-orange-500"
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
                  <p className="mt-1 text-sm text-slate-500">
                    Check everything below, then confirm.
                  </p>

                  <div className="mt-5 space-y-4">
                    {/* Venue and date */}
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                          Venue and date
                        </p>
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="flex items-center gap-1 text-xs font-semibold text-orange-600 hover:underline"
                        >
                          <Pencil size={13} /> Edit
                        </button>
                      </div>
                      <div className="divide-y divide-slate-100">
                        {reviewRow("Venue", venue.name)}
                        {venue.location &&
                          reviewRow("Location", venue.location)}
                        {reviewRow(
                          "Date",
                          selectedDate
                            ? formatDate(selectedDate)
                            : "Not selected"
                        )}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                          Your details
                        </p>
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="flex items-center gap-1 text-xs font-semibold text-orange-600 hover:underline"
                        >
                          <Pencil size={13} /> Edit
                        </button>
                      </div>
                      <div className="divide-y divide-slate-100">
                        {reviewRow("Customer", form.name)}
                        {reviewRow("Phone", form.phone)}
                        {reviewRow("Event", form.eventType)}
                        {reviewRow("Guests", form.guests)}
                        {form.notes.trim() &&
                          reviewRow("Notes", form.notes.trim())}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 p-5 text-white">
                      <span className="text-sm font-semibold">
                        Price estimate
                      </span>
                      <span className="text-2xl font-bold">
                        {money(venue.price)}
                      </span>
                    </div>

                    <p className="text-center text-xs text-slate-500">
                      Demo only: this does not collect payment or contact
                      the venue owner.
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <p
                  role="alert"
                  className="mt-5 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700"
                >
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  {error}
                </p>
              )}
            </>
          )}
        </div>

        {/* Sticky footer navigation */}
        {showFooter && (
          <div className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:px-7">
            <div className="hidden min-w-0 sm:block">
              <p className="text-xs text-slate-500">Estimated price</p>
              <p className="font-bold text-slate-900">
                {money(venue.price)}
                {selectedDate && (
                  <span className="ml-2 text-xs font-medium text-orange-600">
                    {formatShort(selectedDate)}
                  </span>
                )}
              </p>
            </div>

            <div className="flex flex-1 gap-3 sm:flex-none">
              <button
                type="button"
                onClick={goBack}
                className="flex-1 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:flex-none"
              >
                {step === 1 ? "Close" : "Back"}
              </button>

              {step < 4 ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="flex-1 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-orange-200 transition hover:from-orange-600 hover:to-amber-600 active:scale-95 sm:flex-none"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  onClick={confirmBooking}
                  className="flex-1 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-orange-200 transition hover:from-orange-600 hover:to-amber-600 active:scale-95 sm:flex-none"
                >
                  Confirm booking
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Cancellation confirmation */}
      {cancelTarget && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertCircle size={24} />
            </span>

            <h3 className="mt-4 text-lg font-bold text-slate-900">
              Cancel this booking?
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              {cancelTarget.venueName || venue.name} on{" "}
              {formatDate(cancelTarget.date)}. The date will become
              available again if cancellation is permitted.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setCancelTarget(null)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Keep booking
              </button>

              <button
                type="button"
                onClick={cancelBooking}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
              >
                Confirm cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}