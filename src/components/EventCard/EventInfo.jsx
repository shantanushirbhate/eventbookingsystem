import EventMeta from "./EventMeta";
import EventPrice from "./EventPrice";

export default function EventInfo({
  event,
  onViewDetails,
}) {
  return (
    <div className="p-5">
      <h3 className="text-lg font-bold text-slate-900">
        {event.title}
      </h3>

      <EventMeta event={event} />

      <EventPrice
        event={event}
        onViewDetails={onViewDetails}
      />
    </div>
  );
}