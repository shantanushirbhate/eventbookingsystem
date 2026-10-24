
import { useState } from "react";

import BookingHeader from "./BookingHeader";
import VenueSummary from "./VenueSummary";
import BookingFields from "./BookingsFields";
import BookingSuccess from "./BookingSuccess";

export default function BookingForm({
  venue,
  selectedDate,
  onClose,
}) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: selectedDate || "",
    time: "",
    guests: "",
  });

  const [submitted, setSubmitted] = useState(false);

  if (!venue) return null;

  const today = new Date().toLocaleDateString("en-CA");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-green-950/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        className="my-auto w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <BookingHeader venue={venue} onClose={onClose} />

        <div className="p-6 sm:p-8">
          {submitted ? (
            <BookingSuccess venue={venue} onClose={onClose} />
          ) : (
            <>
              <VenueSummary venue={venue} />

              <BookingFields
                form={form}
                venue={venue}
                today={today}
                onChange={handleChange}
                onSubmit={handleSubmit}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
