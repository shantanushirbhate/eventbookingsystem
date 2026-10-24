import EventImage from "./EventImage";
import EventInfo from "./EventInfo";

export default function EventCard({
  event,
  onViewDetails,
}) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <EventImage event={event} />

      <EventInfo
        event={event}
        onViewDetails={onViewDetails}
      />
    </article>
  );
}