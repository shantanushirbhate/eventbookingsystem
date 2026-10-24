
import { MapPin } from "lucide-react";
import NavLinks from "./NavLinks";

export default function MobileSidebar({ menuOpen, onClose }) {
  return (
    <>
      {/* Mobile Backdrop */}
      <button
        type="button"
        tabIndex={menuOpen ? 0 : -1}
        onClick={onClose}
        aria-label="Close navigation menu"
        aria-hidden={!menuOpen}
        className={`fixed inset-x-0 bottom-0 top-[73px] z-40 bg-black/20 transition-opacity duration-300 md:hidden ${
          menuOpen
            ? "visible opacity-100"
            : "invisible pointer-events-none opacity-0"
        }`}
      />

      {/* Mobile Sidebar */}
      <aside
        id="mobile-navigation"
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        className={`fixed right-0 top-[73px] z-50 h-[calc(100dvh-73px)] w-[80%] max-w-sm overflow-y-auto border-l border-orange-100 bg-white/95 shadow-xl backdrop-blur-lg transition-transform duration-300 ease-in-out motion-reduce:transition-none md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-5 px-5 py-6">
          <NavLinks mobile onNavigate={onClose} />

          <div className="flex items-center gap-2 border-t border-orange-100 pt-5 text-sm font-medium text-gray-600">
            <MapPin size={17} className="text-orange-500" />
            Amravati, Maharashtra
          </div>

          <a
            href="#venues"
            onClick={onClose}
            className="rounded-xl bg-orange-500 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 active:scale-95"
          >
            Find a Venue
          </a>
        </div>
      </aside>
    </>
  );
}
