
import {
  CalendarDays,
  Clock,
  User,
  Phone,
  Users,
} from "lucide-react";

import { eventTimeOptions } from "./bookingData";

export default function BookingFields({
  form,
  venue,
  today,
  onChange,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Full Name */}
      <div>
        <label
          htmlFor="booking-name"
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          Full name
        </label>

        <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 transition focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-500/10">
          <User size={18} className="text-orange-500" />

          <input
            id="booking-name"
            name="name"
            value={form.name}
            onChange={onChange}
            required
            maxLength={100}
            autoComplete="name"
            placeholder="Enter your full name"
            className="w-full py-3.5 text-sm outline-none"
          />
        </div>
      </div>

      {/* Phone Number */}
      <div>
        <label
          htmlFor="booking-phone"
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          Phone number
        </label>

        <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 transition focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-500/10">
          <Phone size={18} className="text-orange-500" />

          <input
            id="booking-phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={onChange}
            required
            maxLength={10}
            minLength={10}
            pattern="[6-9][0-9]{9}"
            title="Enter a valid 10-digit Indian mobile number"
            autoComplete="tel-national"
            inputMode="numeric"
            placeholder="10-digit mobile number"
            className="w-full py-3.5 text-sm outline-none"
          />
        </div>
      </div>

      {/* Date and Time */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="booking-date"
            className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700"
          >
            <CalendarDays size={16} className="text-orange-500" />
            Event date
          </label>

          <input
            id="booking-date"
            name="date"
            type="date"
            value={form.date}
            min={today}
            onChange={onChange}
            required
            className="w-full rounded-xl border border-gray-200 px-3 py-3.5 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
          />
        </div>

        <div>
          <label
            htmlFor="booking-time"
            className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700"
          >
            <Clock size={16} className="text-orange-500" />
            Event time
          </label>

          <select
            id="booking-time"
            name="time"
            value={form.time}
            onChange={onChange}
            required
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3.5 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
          >
            <option value="">Select time</option>

            {eventTimeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Number of Guests */}
      <div>
        <label
          htmlFor="booking-guests"
          className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700"
        >
          <Users size={17} className="text-orange-500" />
          Number of guests
        </label>

        <input
          id="booking-guests"
          name="guests"
          type="number"
          min="1"
          max={venue.capacity}
          value={form.guests}
          onChange={onChange}
          required
          placeholder={`Maximum ${venue.capacity} guests`}
          className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
        />

        <p className="mt-1.5 text-xs text-gray-500">
          Maximum capacity: {venue.capacity} guests
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full rounded-xl bg-orange-500 px-5 py-4 font-semibold text-white shadow-sm transition hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-200 active:scale-[0.99]"
      >
        Submit Demo Request
      </button>

      <p className="text-center text-xs leading-5 text-gray-400">
        Demo only. This does not reserve a venue or verify availability.
      </p>
    </form>
  );
}
