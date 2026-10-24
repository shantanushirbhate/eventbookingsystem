
import { CheckCircle } from "lucide-react";

export default function BookingSuccess({ venue, onClose }) {
  return (
    <div className="py-6 text-center">
      <CheckCircle
        size={56}
        className="mx-auto text-green-500"
      />

      <h3 className="mt-4 text-2xl font-bold text-gray-900">
        Request details captured!
      </h3>

      <p className="mt-3 text-sm leading-6 text-gray-600">
        Your demo request for {venue.name} has been validated
        in this interface. No actual booking has been made,
        and the venue's availability has not been checked.
      </p>

      <button
        type="button"
        onClick={onClose}
        className="mt-6 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-200"
      >
        Close
      </button>
    </div>
  );
}
