export default function FooterVenueTypes() {
  const venueTypes = [
    "Banquet Halls",
    "Wedding Lawns",
    "Party Halls",
    "Event Spaces",
  ];

  return (
    <div>
      <h3 className="font-semibold text-white">Venue Types</h3>

      <ul className="mt-5 space-y-4 text-sm">
        {venueTypes.map((type) => (
          <li key={type}>{type}</li>
        ))}
      </ul>
    </div>
  );
}