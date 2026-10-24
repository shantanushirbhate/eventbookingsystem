
import { useState } from "react";
import { Menu, X, MapPin } from "lucide-react";

import BrandLogo from "./BrandLogoo";
import NavLinks from "./NavLinks";
import MobileSidebar from "./MobileSidebarr";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-orange-100/50 bg-white/70 shadow-sm backdrop-blur-lg">
      <nav className="navbar-font mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        {/* Logo */}
        <BrandLogo onClick={closeMenu} />

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <NavLinks />
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-5 md:flex">
          <span className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
            <MapPin size={17} className="text-orange-500" />
            Amravati, MH
          </span>

          <a
            href="#venues"
            className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-md active:scale-95"
          >
            Find a Venue
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={toggleMenu}
          className="ml-auto rounded-xl p-2 text-gray-700 transition hover:bg-amber-100 hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          {menuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </nav>

      {/* Mobile Sidebar */}
      <MobileSidebar
        menuOpen={menuOpen}
        onClose={closeMenu}
      />
    </header>
  );
}
