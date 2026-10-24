import BrandLogo from "../Navbar/BrandLogoo";
import { MapPin } from "lucide-react";

export default function FooterBrand() {
  return (
    <div>
      <BrandLogo />

      <p className="mt-5 max-w-xs text-sm leading-7 text-gray-400">
        Discover event spaces for weddings, celebrations and
        special occasions in Amravati, Maharashtra.
      </p>

      <p className="mt-4 flex items-center gap-2 text-sm text-gray-400">
        <MapPin size={17} className="shrink-0 text-orange-400" />
        Amravati, Maharashtra, India
      </p>
    </div>
  );
}