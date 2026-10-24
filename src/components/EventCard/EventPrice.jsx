import { ArrowUpRight } from "lucide-react";

export default function EventPrice({
  event,
  onViewDetails,
}) {
  return (
    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
      <div>
        <p className="text-xs text-slate-500">
          Sample price per person
        </p>

        <p className="text-xl font-bold text-slate-900">
          ₹{event.price.toLocaleString("en-IN")}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onViewDetails(event)}
        className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 active:scale-95"
      >
        Details
        <ArrowUpRight size={16} />
      </button>
    </div>
  );
}