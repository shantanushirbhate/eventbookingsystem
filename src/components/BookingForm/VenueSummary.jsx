
export default function VenueSummary({ venue }) {
  return (
    <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-gray-900">
            {venue.name}
          </h3>

          <p className="mt-1 text-sm text-gray-600">
            {venue.type} · Up to {venue.capacity} guests
          </p>
        </div>

        <p className="shrink-0 font-bold text-orange-600">
          ₹{venue.price.toLocaleString("en-IN")}
        </p>
      </div>
    </div>
  );
}
