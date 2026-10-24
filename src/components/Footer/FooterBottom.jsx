export default function FooterBottom() {
  return (
    <div className="mt-12 border-t border-white/10 pt-6">
      <p className="text-center text-xs leading-6 text-gray-500">
        © {new Date().getFullYear()} EventNest. Demo project.
        Venue details and booking availability are not verified.
      </p>
    </div>
  );
}