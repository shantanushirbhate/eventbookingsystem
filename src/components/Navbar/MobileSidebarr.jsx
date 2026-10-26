import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { MapPin, ChevronDown } from "lucide-react";

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

  const linkClass =
    "block rounded-lg px-3 py-3 font-semibold text-gray-800 transition hover:bg-orange-50 hover:text-orange-600";

  const renderType = (type, label, data) => (
    <div>
      <button
        type="button"
        onClick={() => {
          setOpenType(openType === type ? null : type);
          setOpenCategory(null);
        }}
        className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-gray-700 hover:bg-orange-50"
      >
        {label}
        <ChevronDown
          size={16}
          className={`transition-transform ${
            openType === type ? "rotate-180" : ""
          }`}
        />
      </button>

      {openType === type && (
        <div className="ml-3 border-l border-orange-100 pl-3">
          {Object.entries(data).map(([category, subs]) => (
            <div key={category}>
              <button
                type="button"
                onClick={() =>
                  setOpenCategory(openCategory === category ? null : category)
                }
                className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm text-gray-600 hover:bg-orange-50"
              >
                {category}
                <ChevronDown
                  size={15}
                  className={`transition-transform ${
                    openCategory === category ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openCategory === category && (
                <div className="ml-3 space-y-1 pb-2">
                  <Link
                    to={createUrl(type, category, "")}
                    onClick={onClose}
                    className="block rounded-lg px-3 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50"
                  >
                    All {category}
                  </Link>

                  {subs.map((sub) => (
                    <Link
                      key={sub}
                      to={createUrl(type, category, sub)}
                      onClick={onClose}
                      className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                    >
                      {sub}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return createPortal(
    <>
      {/* Backdrop */}
      <button
        type="button"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
        aria-label="Close navigation menu"
        aria-hidden={!open}
        className={`fixed inset-x-0 bottom-0 top-[73px] z-[60] bg-black/30 transition-opacity duration-300 xl:hidden ${
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
        className={`fixed right-0 top-[73px] z-[70] h-[calc(100dvh-73px)] w-[80%] max-w-sm overflow-y-auto border-l border-orange-100 bg-white shadow-xl transition-transform duration-300 ease-in-out motion-reduce:transition-none xl:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-5 px-5 py-6">
          <nav className="space-y-1">
            <Link to="/" onClick={onClose} className={linkClass}>
              Home
            </Link>

            <div>
              <button
                type="button"
                onClick={() => setExploreOpen((prev) => !prev)}
                aria-expanded={exploreOpen}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-left font-bold transition hover:bg-orange-50 ${
                  exploreOpen ? "text-orange-500" : "text-gray-800"
                }`}
              >
                Explore
                <ChevronDown
                  size={18}
                  className={`transition-transform ${
                    exploreOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {exploreOpen && (
                <div className="ml-3 space-y-1 border-l border-orange-100 pl-3">
                  {renderType("events", "Events", eventSubcategories)}
                  {renderType("venues", "Venues", venueSubcategories)}
                </div>
              )}
            </div>

            <Link to="/#how-it-works" onClick={onClose} className={linkClass}>
              How It Works
            </Link>
          </nav>

          <div className="flex items-center gap-2 border-t border-orange-100 pt-5 text-sm font-medium text-gray-600">
            <MapPin size={17} className="text-orange-500" />
            Amravati, Maharashtra
          </div>

          <Link
            to="/venues"
            onClick={onClose}
            className="rounded-xl bg-orange-500 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 active:scale-95"
          >
            Find a Venue
          </Link>
        </div>
      </aside>
    </>,
    document.body
  );
}