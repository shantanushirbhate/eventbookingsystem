import VenueImage from "./VenueImage";
import VenueInfo from "./VenueInfo";
import VenueAmenities from "./VenueAmenities";
import VenuePrice from "./VenuePrice";
import VenueCardButton from "./VenueCardButton";

export default function VenueCard({ venue, onBook }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <VenueImage venue={venue} />

      <div className="p-5">
        <VenueInfo venue={venue} />

        <VenueAmenities amenities={venue.amenities} />

        <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
          <VenuePrice price={venue.price} />

          <VenueCardButton onClick={() => onBook(venue)} />
        </div>
      </div>
    </article>
  );
}