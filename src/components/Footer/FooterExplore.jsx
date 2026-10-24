export default function FooterExplore() {
  const links = [
    { label: "All Venues", href: "#venues" },
    { label: "Event Categories", href: "#event-types" },
    { label: "How It Works", href: "#how-it-works" },
  ];

  return (
    <div>
      <h3 className="font-semibold text-white">Explore</h3>

      <ul className="mt-5 space-y-4 text-sm">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="transition-colors hover:text-orange-400"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}