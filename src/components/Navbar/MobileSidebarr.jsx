import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
  MapPin,
  ChevronDown,
  Home,
  Compass,
  Info,
  CalendarHeart,
  Building2,
  ArrowRight,
} from "lucide-react";

// Small emoji badge for each category (falls back to a sparkle)
const categoryEmoji = {
  Wedding: "💍",
  Birthday: "🎂",
  Engagement: "💫",
  Corporate: "💼",
  Concert: "🎤",
  Festival: "🎉",
  "Banquet Hall": "🏛️",
  "Wedding Lawn": "🌿",
  "Party Hall": "🎈",
  "Event Space": "🏟️",
};

export default function MobileSidebar({
  menuOpen,
  isOpen,
  onClose,
  eventSubcategories = {},
  venueSubcategories = {},
}) {
  // Works whether Navbar passes `menuOpen` or `isOpen`
  const open = Boolean(menuOpen ?? isOpen);

  const [exploreOpen, setExploreOpen] = useState(false);
  const [openType, setOpenType] = useState(null);
  const [openCategory, setOpenCategory] = useState(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    if (!open) {
      setExploreOpen(false);
      setOpenType(null);
      setOpenCategory(null);
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const createUrl = (type, category, subcategory) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (subcategory) params.set("subcategory", subcategory);
    return `/${type}?${params.toString()}`;
  };

  // Staggered fade-up for each block when the menu opens
  const stagger = (index) => ({
    transitionDelay: open ? `${120 + index * 60}ms` : "0ms",
  });
  const itemMotion = `transition-all duration-300 motion-reduce:transition-none ${
    open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
  }`;

  // Animated accordion wrapper (smooth height without measuring)
  const Collapse = ({ isOpen: show, children }) => (
    <div
      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out motion-reduce:transition-none ${
        show ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      }`}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  );

  const rowClass =
    "group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-orange-50 active:scale-[0.98]";

  const IconBox = ({ children, active }) => (
    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
        active
          ? "bg-orange-500 text-white shadow-md shadow-orange-200"
          : "bg-orange-50 text-orange-500 group-hover:bg-orange-100"
      }`}
    >
      {children}
    </span>
  );

  const renderType = (type, label, Icon, data) => {
    const isTypeOpen = openType === type;

    return (
      <div>
        <button
          type="button"
          onClick={() => {
            setOpenType(isTypeOpen ? null : type);
            setOpenCategory(null);
          }}
          aria-expanded={isTypeOpen}
          className={`${rowClass} py-2.5`}
        >
          <IconBox active={isTypeOpen}>
            <Icon size={18} />
          </IconBox>
          <span
            className={`flex-1 text-sm font-semibold ${
              isTypeOpen ? "text-orange-600" : "text-gray-800"
            }`}
          >
            {label}
          </span>
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform duration-300 ${
              isTypeOpen ? "rotate-180 text-orange-500" : ""
            }`}
          />
        </button>

        <Collapse isOpen={isTypeOpen}>
          <div className="ml-5 space-y-1 border-l-2 border-orange-100 py-1 pl-3">
            {Object.entries(data).map(([category, subs]) => {
              const isCatOpen = openCategory === category;

              return (
                <div key={category}>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenCategory(isCatOpen ? null : category)
                    }
                    aria-expanded={isCatOpen}
                    className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-left transition hover:bg-orange-50"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-base shadow-sm ring-1 ring-orange-100">
                      {categoryEmoji[category] || "✨"}
                    </span>
                    <span
                      className={`flex-1 text-sm ${
                        isCatOpen
                          ? "font-semibold text-orange-600"
                          : "font-medium text-gray-700"
                      }`}
                    >
                      {category}
                    </span>
                    <ChevronDown
                      size={15}
                      className={`text-gray-400 transition-transform duration-300 ${
                        isCatOpen ? "rotate-180 text-orange-500" : ""
                      }`}
                    />
                  </button>

                  <Collapse isOpen={isCatOpen}>
                    <div className="flex flex-wrap gap-2 px-2.5 pb-3 pt-1">
                      <Link
                        to={createUrl(type, category, "")}
                        onClick={onClose}
                        className="rounded-full bg-orange-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-orange-600 active:scale-95"
                      >
                        All {category}
                      </Link>

                      {subs.map((sub) => (
                        <Link
                          key={sub}
                          to={createUrl(type, category, sub)}
                          onClick={onClose}
                          className="rounded-full border border-orange-200 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-700 transition hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600 active:scale-95"
                        >
                          {sub}
                        </Link>
                      ))}
                    </div>
                  </Collapse>
                </div>
              );
            })}
          </div>
        </Collapse>
      </div>
    );
  };

  return createPortal(
    <>
      {/* Backdrop */}
      <button
        type="button"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
        aria-label="Close navigation menu"
        aria-hidden={!open}
        className={`fixed inset-x-0 bottom-0 top-[73px] z-[60] bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 xl:hidden ${
          open
            ? "visible opacity-100"
            : "invisible pointer-events-none opacity-0"
        }`}
      />

      {/* Sidebar: slides in from the right, out to the right */}
      <aside
        id="mobile-navigation"
        aria-label="Mobile navigation"
        aria-hidden={!open}
        inert={!open}
        className={`fixed right-0 top-[73px] z-[70] flex h-[calc(100dvh-73px)] w-[85%] max-w-sm flex-col overflow-hidden rounded-l-3xl border-l border-orange-100 bg-white shadow-2xl transition-transform duration-300 ease-in-out motion-reduce:transition-none xl:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Welcome header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-500 to-amber-400 px-6 pb-6 pt-7 text-white">
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/15" />
          <div className="pointer-events-none absolute -bottom-10 right-10 h-24 w-24 rounded-full bg-white/10" />

          <p className="text-xs font-semibold uppercase tracking-widest text-orange-100">
            Welcome
          </p>
          <h2 className="mt-1 text-xl font-bold leading-tight">
            Plan your perfect event
          </h2>
          <p className="mt-1 text-sm text-orange-50">
            Discover venues and celebrations near you.
          </p>
        </div>

        {/* Scrollable links */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5">
          <div className={itemMotion} style={stagger(0)}>
            <Link to="/" onClick={onClose} className={rowClass}>
              <IconBox>
                <Home size={18} />
              </IconBox>
              <span className="flex-1 text-sm font-semibold text-gray-800">
                Home
              </span>
            </Link>
          </div>

          {/* Explore */}
          <div className={itemMotion} style={stagger(1)}>
            <button
              type="button"
              onClick={() => setExploreOpen((prev) => !prev)}
              aria-expanded={exploreOpen}
              className={rowClass}
            >
              <IconBox active={exploreOpen}>
                <Compass size={18} />
              </IconBox>
              <span
                className={`flex-1 text-sm font-bold ${
                  exploreOpen ? "text-orange-600" : "text-gray-800"
                }`}
              >
                Explore
              </span>
              <ChevronDown
                size={18}
                className={`text-gray-400 transition-transform duration-300 ${
                  exploreOpen ? "rotate-180 text-orange-500" : ""
                }`}
              />
            </button>

            <Collapse isOpen={exploreOpen}>
              <div className="ml-5 space-y-1 border-l-2 border-orange-100 py-1 pl-2">
                {renderType("events", "Events", CalendarHeart, eventSubcategories)}
                {renderType("venues", "Venues", Building2, venueSubcategories)}
              </div>
            </Collapse>
          </div>

          <div className={itemMotion} style={stagger(2)}>
            <Link to="/#how-it-works" onClick={onClose} className={rowClass}>
              <IconBox>
                <Info size={18} />
              </IconBox>
              <span className="flex-1 text-sm font-semibold text-gray-800">
                How It Works
              </span>
            </Link>
          </div>
        </nav>

        {/* Footer: location + CTA */}
        <div
          className={`space-y-3 border-t border-orange-100 bg-orange-50/50 px-5 py-5 ${itemMotion}`}
          style={stagger(3)}
        >
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-orange-100">
              <MapPin size={16} className="text-orange-500" />
            </span>
            Amravati, Maharashtra
          </div>

          <Link
            to="/venues"
            onClick={onClose}
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-200 transition hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 active:scale-95"
          >
            Find a Venue
            <ArrowRight size={17} />
          </Link>
        </div>
      </aside>
    </>,
    document.body
  );
}