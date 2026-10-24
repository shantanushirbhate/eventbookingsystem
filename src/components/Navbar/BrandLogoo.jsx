
import { CalendarDays } from "lucide-react";
import { logoColors } from "./navbarDataa";

export default function BrandLogo({ onClick }) {
  return (
    <a
      href="#"
      onClick={onClick}
      aria-label="EventNest home"
      className="flex shrink-0 items-center gap-2.5"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white shadow-sm">
        <CalendarDays size={23} strokeWidth={2.2} />
      </span>

      <span className="brand-font whitespace-nowrap text-2xl sm:text-3xl">
        {"EventNest".split("").map((letter, index) => (
          <span key={index} className={logoColors[index]}>
            {letter}
          </span>
        ))}
      </span>
    </a>
  );
}
