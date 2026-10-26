import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  MapPin,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

import BrandLogo from "./BrandLogoo";
import MobileSidebar from "./MobileSidebarr";

const eventSubcategories = {
  Wedding: [
    "Wedding Ceremony",
    "Wedding Reception",
    "Wedding Hall",
    "Wedding Lawn",
    "Destination Wedding",
  ],
  Birthday: [
    "Kids Birthday",
    "Adult Birthday",
    "Birthday Party",
    "Theme Party",
    "Surprise Party",
  ],
  Engagement: [
    "Ring Ceremony",
    "Engagement Party",
    "Pre-Wedding Function",
  ],
  Corporate: [
    "Corporate Meeting",
    "Conference",
    "Product Launch",
    "Office Party",
    "Team Building Event",
  ],
  Concert: [
    "Live Music",
    "DJ Night",
    "Music Festival",
    "Live Performance",
  ],
  Festival: [
    "Cultural Festival",
    "Religious Festival",
    "Community Celebration",
    "Seasonal Festival",
  ],
};

const venueSubcategories = {
  "Banquet Hall": [
    "Wedding Banquet Hall",
    "AC Banquet Hall",
    "Luxury Banquet Hall",
    "Small Banquet Hall",
    "Reception Hall",
  ],
  "Wedding Lawn": [
    "Outdoor Wedding Lawn",
    "Garden Wedding Venue",
    "Luxury Wedding Lawn",
    "Resort Wedding Venue",
    "Open-Air Wedding Venue",
  ],
  "Party Hall": [
    "Birthday Party Hall",
    "Engagement Party Hall",
    "Anniversary Party Hall",
    "Private Party Hall",
    "Kids Party Hall",
  ],
  "Event Space": [
    "Corporate Event Space",
    "Conference Venue",
    "Convention Hall",
    "Exhibition Space",
    "Concert Venue",
  ],
};

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [activeType, setActiveType] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  const navbarRef = useRef(null);

  const closeMenu = () => {
    setOpenDropdown(false);
    setActiveType(null);
    setActiveCategory(null);
    setMenuOpen(false);
  };

  const toggleExplore = () => {
    setOpenDropdown((previous) => !previous);
    setActiveType(null);
    setActiveCategory(null);
  };

  const openTypePanel = (type) => {
    setActiveType(type);
    setActiveCategory(null);
  };

  const categories =
    activeType === "events"
      ? eventSubcategories
      : venueSubcategories;

  const createCategoryUrl = (type, category, subcategory) => {
    const params = new URLSearchParams();

    if (category) params.set("category", category);
    if (subcategory) params.set("subcategory", subcategory);

    return `/${type}?${params.toString()}`;
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        navbarRef.current &&
        !navbarRef.current.contains(event.target)
      ) {
        setOpenDropdown(false);
        setActiveType(null);
        setActiveCategory(null);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Close the mobile menu if the screen grows to desktop width (xl = 1280px)
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1280px)");

    const handleResize = (event) => {
      if (event.matches) {
        setMenuOpen(false);
      }
    };

    mediaQuery.addEventListener("change", handleResize);

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  const renderSubcategoryPanel = () => {
    if (!activeType || !activeCategory) return null;

    const typeLabel =
      activeType === "events" ? "events" : "venues";

    const subcategories = categories[activeCategory] || [];

    return (
      <div className="absolute left-[450px] top-full z-50 mt-2 w-[280px] max-h-[70vh] overflow-y-auto rounded-2xl border border-gray-100 bg-white p-4 shadow-xl">
        <button
          type="button"
          onClick={() => setActiveCategory(null)}
          className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-orange-500"
        >
          <ArrowLeft size={16} />
          Back to categories
        </button>

        <h3 className="mb-3 border-b border-gray-100 pb-3 text-base font-bold text-gray-900">
          {activeCategory}
        </h3>

        <div className="space-y-1">
          <Link
            to={createCategoryUrl(typeLabel, activeCategory, "")}
            onClick={closeMenu}
            className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
          >
            All {activeCategory}
          </Link>

          {subcategories.map((subcategory) => (
            <Link
              key={subcategory}
              to={createCategoryUrl(
                typeLabel,
                activeCategory,
                subcategory
              )}
              onClick={closeMenu}
              className="flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm text-gray-600 transition hover:bg-orange-50 hover:text-orange-600"
            >
              <span>{subcategory}</span>
              <ChevronRight size={15} className="shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <header
        ref={navbarRef}
        className="sticky top-0 z-50 border-b border-white/40 bg-white/90 shadow-sm backdrop-blur-xl"
      >
        <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            to="/"
            onClick={closeMenu}
            className="shrink-0"
          >
            <BrandLogo />
          </Link>

          {/* Desktop navigation: shown on large desktop screens */}
          <div className="hidden items-center gap-6 xl:flex 2xl:gap-8">
            <Link
              to="/"
              onClick={closeMenu}
              className="whitespace-nowrap font-medium text-gray-700 transition hover:text-orange-500"
            >
              Home
            </Link>

            <div className="relative">
              <button
                type="button"
                onClick={toggleExplore}
                aria-expanded={openDropdown}
                className={`flex items-center gap-2 whitespace-nowrap font-bold transition ${
                  openDropdown
                    ? "text-orange-500"
                    : "text-gray-800 hover:text-orange-500"
                }`}
              >
                Explore
                <ChevronDown
                  size={17}
                  className={`transition-transform ${
                    openDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openDropdown && (
                <>
                  {/* Main Explore panel */}
                  <div className="absolute left-0 top-full z-50 mt-2 w-[220px] rounded-2xl border border-gray-100 bg-white p-4 shadow-xl">
                    <h3 className="mb-3 border-b border-gray-100 pb-3 text-base font-bold text-gray-900">
                      Explore
                    </h3>

                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => openTypePanel("events")}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-semibold transition ${
                          activeType === "events"
                            ? "bg-orange-50 text-orange-600"
                            : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                        }`}
                      >
                        Events
                        <ChevronRight size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => openTypePanel("venues")}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-semibold transition ${
                          activeType === "venues"
                            ? "bg-orange-50 text-orange-600"
                            : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                        }`}
                      >
                        Venues
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Event and venue categories */}
                  {activeType && (
                    <div className="absolute left-[220px] top-full z-50 mt-2 w-[230px] max-h-[70vh] overflow-y-auto rounded-2xl border border-gray-100 bg-white p-4 shadow-xl">
                      <h3 className="mb-3 border-b border-gray-100 pb-3 text-base font-bold text-gray-900">
                        {activeType === "events"
                          ? "Event Categories"
                          : "Venue Categories"}
                      </h3>

                      <div className="space-y-1">
                        {Object.keys(categories).map((category) => (
                          <button
                            type="button"
                            key={category}
                            onClick={() =>
                              setActiveCategory(category)
                            }
                            className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                              activeCategory === category
                                ? "bg-orange-50 font-semibold text-orange-600"
                                : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                            }`}
                          >
                            <span>{category}</span>
                            <ChevronRight size={15} />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {renderSubcategoryPanel()}
                </>
              )}
            </div>

            <Link
              to="/#how-it-works"
              onClick={closeMenu}
              className="whitespace-nowrap font-medium text-gray-700 transition hover:text-orange-500"
            >
              How It Works
            </Link>
          </div>

          {/* Location and CTA */}
          <div className="hidden items-center gap-4 xl:flex 2xl:gap-5">
            <div className="flex items-center gap-2 whitespace-nowrap text-sm text-gray-600">
              <MapPin size={17} className="text-orange-500" />
              <span>Amravati</span>
            </div>

            <Link
              to="/venues"
              onClick={closeMenu}
              className="whitespace-nowrap rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-orange-600 active:scale-95"
            >
              Find a Venue
            </Link>
          </div>

          {/* Hamburger: visible on mobile and tablet */}
          <button
            type="button"
            onClick={() => setMenuOpen((previous) => !previous)}
            className="ml-auto flex shrink-0 items-center justify-center rounded-lg p-2 text-gray-800 transition hover:bg-orange-50 xl:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={25} /> : <Menu size={25} />}
          </button>
        </nav>
      </header>

      {/* Sidebar stays mounted so it can slide in AND out.
          It renders through a portal inside MobileSidebarr.jsx. */}
      <MobileSidebar
        isOpen={menuOpen}
        onClose={closeMenu}
        eventSubcategories={eventSubcategories}
        venueSubcategories={venueSubcategories}
      />
    </>
  );
}