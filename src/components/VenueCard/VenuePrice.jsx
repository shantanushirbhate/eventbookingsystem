export default function VenuePrice({ price }) {
  return (
    <div>
      <p className="text-xs text-gray-500">Starting from</p>

      <p className="mt-1 text-xl font-bold text-gray-900">
        ₹{price.toLocaleString("en-IN")}
        <span className="text-xs font-normal text-gray-500">
          {" "}/ event
        </span>
      </p>
    </div>
  );
}