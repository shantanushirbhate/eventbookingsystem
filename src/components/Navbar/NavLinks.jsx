import { navLinks } from "./navbarDataa";

export default function NavLinks({
  mobile = false,
  onNavigate,
}) {
  return navLinks.map(({ name, href }) => (
    <a
      key={name}
      href={href}
      onClick={onNavigate}
      className={
        mobile
          ? "rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-amber-50 hover:text-orange-600"
          : "text-sm font-semibold tracking-[-0.01em] text-gray-700 transition-colors hover:text-orange-600"
      }
    >
      {name}
    </a>
  ));
}