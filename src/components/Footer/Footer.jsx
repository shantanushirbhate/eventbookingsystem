
import FooterBrand from "./FooterBrand";
import FooterExplore from "./FooterExplore";
import FooterVenueTypes from "./FooterVenueTypes";
import FooterGetStarted from "./FooterGetStarted";
import FooterBottom from "./FooterBottom";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-gray-300">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <FooterBrand />
          <FooterExplore />
          <FooterVenueTypes />
          <FooterGetStarted />
        </div>

        <FooterBottom />
      </div>
    </footer>
  );
}